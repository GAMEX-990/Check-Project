'use client'
import React from 'react'
import {  CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from "next/image";

const Logo = () => {
  return (
      <motion.div 
        className="relative flex items-center"
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 200, damping: 10 }}
      >
        <div>
        <Image 
              src="/assets/images/Logocheck.PNG" 
              alt="Logocheck" 
              width={40} 
              height={40} 
              className="mr-3" 
            />
        </div>
        <div className="ml-3 flex items-center">
          <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-purple-500">Check</span>
          <CheckCircle size={16} className="ml-1 text-green-500" />
        </div>
      </motion.div>
  )
}

export default Logo