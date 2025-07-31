import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore";
import { useCallback, useState, useEffect } from "react";

export const useHasScanned = () => {
    const [user, setUser] = useState<User | null>(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [hasScanned, setHasScanned] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setAuthLoading(false);
        });
        return () => unsubscribe();
    }, []);
    // ดึงข้อมูล scan status เมื่อ user เปลี่ยน
    useEffect(() => {
        const fetchScanStatus = async () => {
            if (authLoading) return;
            if (!user?.uid) {
                setHasScanned(false);
                setLoading(false);
                return;
            }

            try {
                const userDocRef = doc(db, "userSettings", user.uid);
                const docSnap = await getDoc(userDocRef);

                if (docSnap.exists()) {
                    setHasScanned(docSnap.data().hasScanned || false);
                } else {
                    setHasScanned(false);
                }
            } catch (error) {
                setHasScanned(false);
            } finally {
                setLoading(false);
            }
        };

        fetchScanStatus();
    }, [user?.uid, authLoading]);

    const updateScanStatus = useCallback(async (newStatus: boolean) => {
        if (!user?.uid) return;

        const userDocRef = doc(db, "userSettings", user.uid);

        try {
            await updateDoc(userDocRef, {
                hasScanned: newStatus,
                updatedAt: new Date()
            });
            setHasScanned(newStatus);
        } catch (error) {
            // ถ้า document ไม่มี ให้สร้างใหม่
            try {
                await setDoc(userDocRef, {
                    hasScanned: newStatus,
                    userId: user.uid,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
                setHasScanned(newStatus);
            } catch (createError) {
            }
        }
    }, [user?.uid]);

    const updateScanStatusSimple = useCallback(async (newStatus: boolean) => {
        if (!user?.uid) return;
        const userDocRef = doc(db, "userSettings", user.uid);
        try {
            await setDoc(userDocRef, {
                hasScanned: newStatus,
                userId: user.uid,
                updatedAt: new Date(),
                ...(!(await getDoc(userDocRef)).exists() && {
                    createdAt: new Date()
                })
            },{merge: true});
            setHasScanned(newStatus);
        } catch (error) {
        }
    }, [user?.uid]);

    // Return ค่าที่จำเป็นสำหรับหน้าอื่น
    return {
        updateScanStatus: updateScanStatusSimple,
        user,
        hasScanned,
        loading: authLoading || loading,
    };
}