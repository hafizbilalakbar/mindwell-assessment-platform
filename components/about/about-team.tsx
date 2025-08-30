"use client"

import { useRef, useState } from "react"
import { motion } from "framer-motion"
import { Linkedin, Twitter, Mail, ChevronLeft, ChevronRight } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export function AboutTeam() {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  const team = [
    {
      name: "Dr. Sarah Johnson",
      role: "Chief Clinical Officer",
      bio: "Licensed clinical psychologist with 15+ years of experience in mental health assessment and treatment.",
      avatar: "/images/about-images/Dr.Sarah-Johnson.jpg",
      initials: "SJ",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "sarah@mindwell.com",
      },
      achievements: ["Published 25+ research papers", "Harvard Medical School graduate", "Mental Health Innovation Award 2022"]
    },
    {
      name: "Michael Chen",
      role: "Chief Technology Officer",
      bio: "Former Google engineer passionate about using technology to improve mental health accessibility.",
      avatar: "/images/about-images/Michael-Chen.jpg",
      initials: "MC",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "michael@mindwell.com",
      },
      achievements: ["Led AI projects at Google", "MIT Computer Science", "Tech for Good Award 2023"]
    },
    {
      name: "Dr. Aisha Patel",
      role: "Head of Research",
      bio: "PhD in Psychology with expertise in psychometric assessment and digital mental health interventions.",
      avatar: "/images/about-images/Dr.AishaPatel.jpg",
      initials: "AP",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "aisha@mindwell.com",
      },
      achievements: ["Published in Nature Journal", "Stanford Psychology PhD", "Digital Health Pioneer"]
    },
    {
      name: "James Rodriguez",
      role: "Head of Product",
      bio: "Product leader with a passion for creating user-centered experiences in healthcare technology.",
      avatar: "/images/about-images/James-Rodriguez.png",
      initials: "JR",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "james@mindwell.com",
      },
      achievements: ["Former UX Director at Apple", "Healthcare UX Innovation Award", "10+ Years in Digital Health"]
    },
  ]

  const nextSlide = () => {
    if (activeIndex < team.length - 1) {
      setActiveIndex(activeIndex + 1);
    } else {
      setActiveIndex(0);
    }
  };

  const prevSlide = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    } else {
      setActiveIndex(team.length - 1);
    }
  };

  const goToSlide = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <section className="py-24 team-section">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
            <span className="text-sm font-medium text-white">Our Leadership</span>
          </div>
          
          <h2 className="heading-secondary text-white mb-4 text-3d text-4xl md:text-5xl font-bold">
            Meet Our
            <span className="block gradient-text">Expert Team</span>
          </h2>
          
          <p className="text-lg text-white/80 max-w-3xl mx-auto">
            Our diverse team of mental health professionals, technologists, and researchers work together to create the
            best possible experience for our users.
          </p>
        </motion.div>

        {/* Desktop View - Grid Layout */}
        <div className="hidden lg:grid grid-cols-4 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={index}
              className="team-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <div className="team-card-inner glass rounded-2xl p-6 border border-white/20 text-center hover:bg-white/10 transition-all duration-300 h-full flex flex-col">
                <div className="team-image-container mb-6 relative">
                  <div className="w-32 h-32 mx-auto relative">
                    <div className="w-full h-full rounded-full overflow-hidden border-4 border-white/30">
                      <Image 
                        src={member.avatar} 
                        alt={member.name} 
                        width={128}
                        height={128}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-500/30 to-transparent rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  <motion.div 
                    className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-1 rounded-full text-xs text-white font-medium"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    {member.role}
                  </motion.div>
                </div>

                <h3 className="text-xl font-semibold text-white mb-2">{member.name}</h3>
                <p className="text-sm text-white/70 mb-4 leading-relaxed flex-grow">{member.bio}</p>
                
                <div className="mt-auto">
                  <div className="border-t border-white/10 pt-4 mb-4">
                    <ul className="text-xs text-white/70">
                      {member.achievements.map((achievement, i) => (
                        <li key={i} className="mb-1 flex items-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mr-2"></span>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="team-social-icons flex justify-center gap-3">
                    <motion.a
                      href={member.social.linkedin}
                      className="team-social-icon-container bg-white/10 dark:bg-white/5"
                      whileHover={{ 
                        y: -5, 
                        rotate: 5,
                        backgroundColor: "rgba(255, 255, 255, 0.3)",
                        boxShadow: "0 10px 15px -3px rgba(124, 58, 237, 0.5)"
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <Linkedin className="team-social-icon h-4 w-4" />
                    </motion.a>
                    <motion.a
                      href={member.social.twitter}
                      className="team-social-icon-container bg-white/10 dark:bg-white/5"
                      whileHover={{ 
                        y: -5, 
                        rotate: -5,
                        backgroundColor: "rgba(255, 255, 255, 0.3)",
                        boxShadow: "0 10px 15px -3px rgba(124, 58, 237, 0.5)"
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <Twitter className="team-social-icon h-4 w-4" />
                    </motion.a>
                    <motion.a
                      href={`mailto:${member.social.email}`}
                      className="team-social-icon-container bg-white/10 dark:bg-white/5"
                      whileHover={{ 
                        y: -5, 
                        scale: 1.1,
                        backgroundColor: "rgba(255, 255, 255, 0.3)",
                        boxShadow: "0 10px 15px -3px rgba(124, 58, 237, 0.5)"
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <Mail className="team-social-icon h-4 w-4" />
                    </motion.a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile/Tablet View - Carousel */}
        <div className="lg:hidden relative">
          <div 
            ref={carouselRef}
            className="overflow-hidden"
          >
            <div 
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {team.map((member, index) => (
                <div 
                  key={index} 
                  className="w-full flex-shrink-0 px-4"
                >
                  <motion.div
                    className="team-card"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                  >
                    <div className="team-card-inner glass rounded-2xl p-6 border border-white/20 text-center">
                      <div className="team-image-container mb-6 relative">
                        <div className="w-32 h-32 mx-auto relative">
                          <div className="w-full h-full rounded-full overflow-hidden border-4 border-white/30">
                            <Image 
                              src={member.avatar} 
                              alt={member.name} 
                              width={128}
                              height={128}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        </div>
                        
                        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-1 rounded-full text-xs text-white font-medium">
                          {member.role}
                        </div>
                      </div>

                      <h3 className="text-xl font-semibold text-white mb-2">{member.name}</h3>
                      <p className="text-sm text-white/70 mb-4 leading-relaxed">{member.bio}</p>
                      
                      <div className="border-t border-white/10 pt-4 mb-4">
                        <ul className="text-xs text-white/70">
                          {member.achievements.map((achievement, i) => (
                            <li key={i} className="mb-1 flex items-center">
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mr-2"></span>
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="team-social-icons flex justify-center gap-3">
                        <motion.a
                          href={member.social.linkedin}
                          className="team-social-icon-container bg-white/10 dark:bg-white/5"
                          whileHover={{ 
                            y: -5, 
                            rotate: 5,
                            backgroundColor: "rgba(255, 255, 255, 0.3)",
                            boxShadow: "0 10px 15px -3px rgba(124, 58, 237, 0.5)"
                          }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          <Linkedin className="team-social-icon h-4 w-4" />
                        </motion.a>
                        <motion.a
                          href={member.social.twitter}
                          className="team-social-icon-container bg-white/10 dark:bg-white/5"
                          whileHover={{ 
                            y: -5, 
                            rotate: -5,
                            backgroundColor: "rgba(255, 255, 255, 0.3)",
                            boxShadow: "0 10px 15px -3px rgba(124, 58, 237, 0.5)"
                          }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          <Twitter className="team-social-icon h-4 w-4" />
                        </motion.a>
                        <motion.a
                          href={`mailto:${member.social.email}`}
                          className="team-social-icon-container bg-white/10 dark:bg-white/5"
                          whileHover={{ 
                            y: -5, 
                            scale: 1.1,
                            backgroundColor: "rgba(255, 255, 255, 0.3)",
                            boxShadow: "0 10px 15px -3px rgba(124, 58, 237, 0.5)"
                          }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          <Mail className="team-social-icon h-4 w-4" />
                        </motion.a>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Carousel Controls */}
          <div className="flex justify-between items-center mt-8">
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={prevSlide}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            
            <div className="flex gap-2">
              {team.map((_, index) => (
                <button
                  key={index}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    activeIndex === index ? "bg-white scale-125" : "bg-white/30"
                  }`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
            
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={nextSlide}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
