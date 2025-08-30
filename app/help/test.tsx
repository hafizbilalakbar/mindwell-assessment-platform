"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

export default function TestPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-center">Test Help Center Links</h1>
          
          <div className="max-w-4xl mx-auto space-y-12">
            <div>
              <h2 className="text-xl font-bold mb-4">Main Help Pages</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button asChild variant="outline" size="lg" className="w-full">
                  <Link href="/help">Main Help Page</Link>
                </Button>
                
                <Button asChild variant="outline" size="lg" className="w-full">
                  <Link href="/help/documentation">Documentation</Link>
                </Button>
                
                <Button asChild variant="outline" size="lg" className="w-full">
                  <Link href="/help/forum">Community Forum</Link>
                </Button>
                
                <Button asChild variant="outline" size="lg" className="w-full">
                  <Link href="/help/resources">Resources</Link>
                </Button>
                
                <Button asChild variant="outline" size="lg" className="w-full">
                  <Link href="/contact">Contact Support</Link>
                </Button>
                
                <Button asChild variant="outline" size="lg" className="w-full">
                  <Link href="/help/not-found?q=test">Not Found Page</Link>
                </Button>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h2 className="text-xl font-bold mb-4">Documentation Links</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button asChild variant="outline" size="lg" className="w-full">
                  <Link href="/about">About MindWell</Link>
                </Button>
                
                <Button asChild variant="outline" size="lg" className="w-full">
                  <Link href="/assessment">Assessments</Link>
                </Button>
                
                <Button asChild variant="outline" size="lg" className="w-full">
                  <Link href="/relaxation">Relaxation Activities</Link>
                </Button>
                
                <Button asChild variant="outline" size="lg" className="w-full">
                  <Link href="/privacy">Privacy Policy</Link>
                </Button>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h2 className="text-xl font-bold mb-4">Forum Category Links</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button asChild variant="outline" size="lg" className="w-full">
                  <Link href="/help/forum?category=mental-wellness">Mental Wellness</Link>
                </Button>
                
                <Button asChild variant="outline" size="lg" className="w-full">
                  <Link href="/relaxation/meditation">Meditation & Mindfulness</Link>
                </Button>
                
                <Button asChild variant="outline" size="lg" className="w-full">
                  <Link href="/assessment">Assessments & Tracking</Link>
                </Button>
                
                <Button asChild variant="outline" size="lg" className="w-full">
                  <Link href="/help/resources">Support & Resources</Link>
                </Button>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h2 className="text-xl font-bold mb-4">Resource Links</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button asChild variant="outline" size="lg" className="w-full">
                  <Link href="/assessment/anxiety">Anxiety Resources</Link>
                </Button>
                
                <Button asChild variant="outline" size="lg" className="w-full">
                  <Link href="/assessment/depression">Depression Resources</Link>
                </Button>
                
                <Button asChild variant="outline" size="lg" className="w-full">
                  <Link href="/relaxation/meditation">Mindfulness Meditation</Link>
                </Button>
                
                <Button asChild variant="outline" size="lg" className="w-full">
                  <Link href="/help/resources#emergency-resources">Emergency Resources</Link>
                </Button>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h2 className="text-xl font-bold mb-4">Search Tests</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button asChild variant="outline" size="lg" className="w-full">
                  <Link href="/help?q=assessment">Search: "assessment"</Link>
                </Button>
                
                <Button asChild variant="outline" size="lg" className="w-full">
                  <Link href="/help?q=anxiety">Search: "anxiety"</Link>
                </Button>
                
                <Button asChild variant="outline" size="lg" className="w-full">
                  <Link href="/help/forum?q=meditation">Forum Search: "meditation"</Link>
                </Button>
                
                <Button asChild variant="outline" size="lg" className="w-full">
                  <Link href="/help/resources?q=crisis">Resources Search: "crisis"</Link>
                </Button>
                
                <Button asChild variant="outline" size="lg" className="w-full">
                  <Link href="/help/documentation?q=account">Docs Search: "account"</Link>
                </Button>
                
                <Button asChild variant="outline" size="lg" className="w-full">
                  <Link href="/help?q=nonexistent">Search: "nonexistent"</Link>
                </Button>
              </div>
            </div>
            
            <p className="text-center text-gray-500 mt-8">
              This test page allows you to quickly verify all the Help center links are working correctly.
              <br />
              You can delete this file after testing.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
} 