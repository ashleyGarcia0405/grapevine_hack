'use client'

import { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from "next-auth/react";
import Image from 'next/image';
import Navbar from '../components/Navbar';
import { useState, useEffect } from 'react';
import AddProjectContent from '../components/AddProjectContent';

export default function AddProject() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AddProjectContent />
    </Suspense>
  );
}