import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Lock, Eye, UserCheck } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="h-8 w-8 text-purple-600" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Privacy Policy</h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Your privacy is our priority. Learn how we protect and handle your personal information.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="space-y-8">
          {/* Information We Collect */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-purple-600" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Personal Information</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                  <li>Name and email address when you create an account</li>
                  <li>Assessment responses and mental health data</li>
                  <li>Usage patterns and interaction data</li>
                  <li>Device information and IP address</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Health Information</h4>
                <p className="text-gray-600 dark:text-gray-300">
                  We collect mental health assessment responses to provide personalized insights and recommendations.
                  This information is treated with the highest level of confidentiality and security.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-purple-600" />
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                <li>Provide personalized mental health assessments and recommendations</li>
                <li>Generate reports and track your progress over time</li>
                <li>Improve our services and develop new features</li>
                <li>Send important updates about your account and our services</li>
                <li>Ensure platform security and prevent fraud</li>
                <li>Comply with legal obligations and protect user safety</li>
              </ul>
            </CardContent>
          </Card>

          {/* Data Protection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-purple-600" />
                Data Protection & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Encryption</h4>
                <p className="text-gray-600 dark:text-gray-300">
                  All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Access Controls</h4>
                <p className="text-gray-600 dark:text-gray-300">
                  Access to your data is strictly limited to authorized personnel who need it to provide our services.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">HIPAA Compliance</h4>
                <p className="text-gray-600 dark:text-gray-300">
                  We maintain HIPAA-level security standards to protect your health information.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Data Sharing */}
          <Card>
            <CardHeader>
              <CardTitle>Data Sharing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We do not sell, rent, or share your personal information with third parties except in the following
                circumstances:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                <li>With your explicit consent</li>
                <li>To comply with legal obligations</li>
                <li>To protect the safety of our users or the public</li>
                <li>
                  With service providers who help us operate our platform (under strict confidentiality agreements)
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card>
            <CardHeader>
              <CardTitle>Your Rights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-4">You have the right to:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                <li>Access your personal data</li>
                <li>Correct inaccurate information</li>
                <li>Delete your account and data</li>
                <li>Export your data</li>
                <li>Opt out of marketing communications</li>
                <li>File a complaint with data protection authorities</li>
              </ul>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                If you have questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="space-y-2 text-gray-600 dark:text-gray-300">
                <p>Email: privacy@mindwell.com</p>
                <p>Phone: +1 (234) 567-890</p>
                <p>Address: 123 Wellness Street, Mental Health City, MH 12345</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
