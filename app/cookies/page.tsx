"use client"

import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Shield, Cookie, CheckCircle, AlertCircle } from "lucide-react"
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"

export default function CookiePolicyPage() {
  const lastUpdated = "May 15, 2024"
  
  const cookieCategories = [
    {
      name: "Essential Cookies",
      description: "These cookies are necessary for the website to function properly. They enable core functionality such as security, authentication, and session management. The website cannot function properly without these cookies.",
      examples: [
        { name: "Session Cookie", purpose: "Maintains your session state across page requests" },
        { name: "CSRF Token", purpose: "Protects against Cross-Site Request Forgery attacks" },
        { name: "Authentication Cookie", purpose: "Keeps you logged in during your visit" }
      ],
      canBeDisabled: false
    },
    {
      name: "Functional Cookies",
      description: "These cookies allow the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages.",
      examples: [
        { name: "Language Preference", purpose: "Remembers your preferred language setting" },
        { name: "Theme Preference", purpose: "Remembers your light/dark mode preference" },
        { name: "User Preferences", purpose: "Stores other interface preferences" }
      ],
      canBeDisabled: true
    },
    {
      name: "Analytics Cookies",
      description: "These cookies help us understand how visitors interact with our website. They provide information about metrics such as number of visitors, bounce rate, traffic source, etc.",
      examples: [
        { name: "Google Analytics", purpose: "Tracks page views, user journeys, and basic demographics" },
        { name: "Hotjar", purpose: "Records session replays and creates heatmaps to improve user experience" },
        { name: "Mixpanel", purpose: "Tracks feature usage and user flow" }
      ],
      canBeDisabled: true
    },
    {
      name: "Marketing Cookies",
      description: "These cookies are used to track visitors across websites. The intention is to display ads that are relevant and engaging for the individual user.",
      examples: [
        { name: "Facebook Pixel", purpose: "Tracks conversions and builds audiences for advertising" },
        { name: "Google Ads", purpose: "Measures ad performance and serves personalized ads" }
      ],
      canBeDisabled: true
    }
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-950 py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center text-center mb-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4"
              >
                <Cookie className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-3xl md:text-4xl font-bold mb-4"
              >
                Cookie Policy
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-gray-600 dark:text-gray-300 max-w-2xl"
              >
                This policy explains how MindWell uses cookies and similar technologies to recognize and remember you when you visit our website.
              </motion.p>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
              <Shield className="h-4 w-4" />
              <span>Last updated: {lastUpdated}</span>
            </div>
          </div>
        </section>
        
        {/* Main Content */}
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="prose dark:prose-invert max-w-none">
              <h2>What Are Cookies?</h2>
              <p>
                Cookies are small text files that are stored on your computer or mobile device when you visit a website. 
                They are widely used to make websites work more efficiently and provide information to the website owners.
                Cookies help websites remember you and your preferences, either for a single visit (through a "session cookie") 
                or for multiple repeat visits (using a "persistent cookie").
              </p>
              
              <h2>How We Use Cookies</h2>
              <p>
                We use cookies for several purposes, including:
              </p>
              <ul>
                <li>Ensuring the website functions properly</li>
                <li>Remembering your preferences and settings</li>
                <li>Understanding how you use our website</li>
                <li>Improving your experience on our site</li>
                <li>Personalizing content and features</li>
              </ul>
              
              <h2>Types of Cookies We Use</h2>
            </div>
            
            <div className="mt-8 space-y-6">
              {cookieCategories.map((category, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex items-start gap-3 mb-4">
                    {category.canBeDisabled ? (
                      <AlertCircle className="h-6 w-6 text-amber-500 flex-shrink-0 mt-1" />
                    ) : (
                      <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                    )}
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                      <p className="text-gray-600 dark:text-gray-300">{category.description}</p>
                      
                      {!category.canBeDisabled && (
                        <div className="mt-2 text-sm font-medium text-green-600 dark:text-green-400">
                          These cookies cannot be disabled as they are essential for the website to function properly.
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Examples</h4>
                    <div className="space-y-3">
                      {category.examples.map((example, i) => (
                        <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                          <div className="font-medium text-gray-900 dark:text-white sm:w-1/3">{example.name}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300 sm:w-2/3">{example.purpose}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-12 prose dark:prose-invert max-w-none">
              <h2>Managing Your Cookie Preferences</h2>
              <p>
                Most web browsers allow you to control cookies through their settings preferences. However, 
                limiting the ability of websites to set cookies may affect your overall user experience. 
                You can find information on how to manage cookies in your browser here:
              </p>
              <ul>
                <li><strong>Chrome:</strong> <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Google Chrome Help Center</a></li>
                <li><strong>Firefox:</strong> <a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer">Mozilla Support</a></li>
                <li><strong>Safari:</strong> <a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471" target="_blank" rel="noopener noreferrer">Safari Help</a></li>
                <li><strong>Edge:</strong> <a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer">Microsoft Support</a></li>
              </ul>
              
              <h2>Changes to Our Cookie Policy</h2>
              <p>
                We may update this Cookie Policy from time to time to reflect changes in technology, regulation, or our business practices. 
                Any changes will be posted on this page with an updated revision date. If we make significant changes to this policy, 
                we may also notify you by other means, such as sending an email or posting a notice on our home page.
              </p>
              
              <h2>Contact Us</h2>
              <p>
                If you have any questions about our use of cookies or this Cookie Policy, please contact us at:
              </p>
              <ul>
                <li>Email: privacy@mindwell.com</li>
                <li>Phone: +1 (234) 567-890</li>
              </ul>
            </div>
            
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-left">Can I withdraw my consent to cookies?</AccordionTrigger>
                  <AccordionContent>
                    Yes, you can withdraw your consent at any time by clearing cookies from your browser or using the cookie 
                    management tool available on our website. Please note that essential cookies cannot be disabled as they 
                    are necessary for the website to function properly.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-left">Do you use cookies for advertising?</AccordionTrigger>
                  <AccordionContent>
                    We use cookies to deliver more relevant advertisements to you both on our website and on third-party websites. 
                    These cookies collect information about your browsing habits to make advertising more relevant to you and your interests.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-left">How long do cookies stay on my device?</AccordionTrigger>
                  <AccordionContent>
                    The length of time a cookie stays on your device depends on its type. Session cookies only last until you close your browser. 
                    Persistent cookies remain on your device until they expire or are deleted. The expiration periods for persistent cookies 
                    can range from minutes to several years.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-left">Does MindWell share cookie data with third parties?</AccordionTrigger>
                  <AccordionContent>
                    We may share cookie data with trusted third-party service providers who assist us in operating our website, 
                    conducting our business, or providing services to you. These third parties are contractually obligated to keep this 
                    information confidential and use it only for the purposes for which we disclose it to them.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
} 