"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Brain,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Heart,
  ShieldCheck,
  Lock,
  Award,
} from "lucide-react";

interface FooterProps {
  className?: string;
}

export function Footer({ className = "" }: FooterProps) {
  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ];

  const quickLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/assessment/welcome", label: "Assessment" },
  ];

  const legalLinks = [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/help", label: "Help Center" },
    { href: "/cookies", label: "Cookie Policy" },
  ];

  const supportLinks = [
    { href: "/help", label: "Help Center" },
    { href: "/contact", label: "Contact" },
    { href: "/faq", label: "FAQ" },
    { href: "/resources", label: "Resources" },
  ];

  return (
    <footer className={`bg-gray-900 text-white ${className}`}>
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Link href="/" className="flex items-center group py-2">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  duration: 0.5,
                }}
                whileHover={{
                  scale: 1.05,
                  filter: "brightness(1.1)",
                  transition: { duration: 0.3, ease: "easeOut" },
                }}
                whileTap={{
                  scale: 0.97,
                  transition: { duration: 0.1 },
                }}
                className="relative w-[120px] xl:w-[150px] flex items-center justify-center"
              >
                <Image
                  src="/mindwell-logo.png"
                  alt="MindWell Logo"
                  width={150}
                  height={150}
                  style={{ width: "100%", height: "auto" }}
                  className="object-contain"
                  priority
                />
              </motion.div>
            </Link>
            <p className="text-sm text-gray-300 leading-relaxed">
              Professional mental health assessment platform helping you
              understand and improve your wellbeing.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-gray-800 hover:bg-purple-600 flex items-center justify-center text-gray-300 hover:text-white transition-all duration-300"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-300 hover:text-purple-400 transition-colors relative group"
                  >
                    {link.label}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Legal Links */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="font-semibold text-white">Legal</h3>
            <ul className="space-y-2">
              {legalLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-300 hover:text-purple-400 transition-colors relative group"
                  >
                    {link.label}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="font-semibold text-white">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <Mail className="h-4 w-4 text-purple-400 flex-shrink-0" />
                <a
                  href="mailto:support@mindwell.com"
                  className="hover:text-purple-400 transition-colors"
                >
                  support@mindwell.com
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <Phone className="h-4 w-4 text-purple-400 flex-shrink-0" />
                <a
                  href="tel:+1234567890"
                  className="hover:text-purple-400 transition-colors"
                >
                  +1 (234) 567-890
                </a>
              </div>
              <div className="flex items-start gap-3 text-sm text-gray-300">
                <MapPin className="h-4 w-4 text-purple-400 flex-shrink-0 mt-0.5" />
                <span>
                  123 Wellness Street
                  <br />
                  Mental Health City, MH 12345
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Emergency Notice */}
        <motion.div
          className="bg-red-900/20 border border-red-800 rounded-lg p-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="flex items-start gap-3">
            <Heart className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-red-200 mb-1">
                Mental Health Emergency
              </h4>
              <p className="text-sm text-red-300">
                If you're experiencing a mental health emergency, please call
                your local emergency services (911) or mental health crisis line
                immediately. This platform is not a substitute for professional
                medical care.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          className="pt-8 border-t border-gray-800 flex flex-col items-center text-center gap-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          {/* Main Text */}
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} MindWell. All rights reserved. Made
            with{" "}
            <Heart className="inline h-4 w-4 text-red-500 mx-1 animate-pulse" />
            for mental health awareness.
          </p>

          <p className="text-xs text-gray-500 mt-1">
            Built by{" "}
            <a
              href="https://github.com/hafizbilalakbar"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-purple-400 hover:text-purple-300 hover:underline transition-colors"
            >
              Hafiz Bilal Akbar
            </a>{" "}
            – Software Engineer
          </p>

          {/* Badges with Icons */}
          <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-400">
            <div className="flex items-center gap-2 bg-gray-800 px-3 py-1 rounded-full">
              <ShieldCheck className="h-4 w-4 text-green-400 animate-pulse" />
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-800 px-3 py-1 rounded-full">
              <Lock className="h-4 w-4 text-blue-400 animate-pulse" />
              <span>SSL Secured</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-800 px-3 py-1 rounded-full">
              <Award className="h-4 w-4 text-yellow-400 animate-pulse" />
              <span>Clinically Validated</span>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
