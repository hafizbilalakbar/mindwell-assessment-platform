"use client"

import { useState, useEffect, useRef } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, ArrowRight, FileText, AlertTriangle, Info, CheckCircle, Heart, Brain, Sparkles, RefreshCw } from "lucide-react"
import Link from "next/link"
import { jsPDF } from "jspdf"
import autoTable from 'jspdf-autotable'
import { toast } from "@/components/ui/use-toast"
import { format } from "date-fns"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

// Define the global interface for window to include our cache clearing function
declare global {
  interface Window {
    clearMindWellCache?: () => boolean;
  }
}

export default function ReportPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [results, setResults] = useState<any>(null)
  const [isPdfGenerating, setIsPdfGenerating] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [wellbeingScore, setWellbeingScore] = useState(50) // Default score
  
  // Refs for GSAP animations
  const reportRef = useRef<HTMLDivElement>(null)
  const mainScoreRef = useRef<HTMLDivElement>(null)
  const stressCardRef = useRef<HTMLDivElement>(null)
  const anxietyCardRef = useRef<HTMLDivElement>(null)
  const depressionCardRef = useRef<HTMLDivElement>(null)
  const recommendationsRef = useRef<HTMLDivElement>(null)
  const actionsRef = useRef<HTMLDivElement>(null)

  // Function to get score level text
  const getScoreLevel = (score: number) => {
    if (score <= 25) return { text: "Excellent", color: "text-green-600" }
    if (score <= 50) return { text: "Good", color: "text-blue-600" }
    if (score <= 75) return { text: "Moderate", color: "text-yellow-600" }
    return { text: "Needs Attention", color: "text-red-600" }
  }
  
  // Function to get progress bar color
  const getProgressColor = (score: number) => {
    if (score <= 25) return "bg-gradient-to-r from-green-400 to-green-500"
    if (score <= 50) return "bg-gradient-to-r from-blue-400 to-blue-500"
    if (score <= 75) return "bg-gradient-to-r from-yellow-400 to-yellow-500"
    return "bg-gradient-to-r from-red-400 to-red-500"
  }
  
  // Function to get icon based on score
  const getScoreIcon = (score: number) => {
    if (score <= 25) return <CheckCircle className="h-6 w-6 text-green-500" />
    if (score <= 50) return <Info className="h-6 w-6 text-blue-500" />
    if (score <= 75) return <AlertTriangle className="h-6 w-6 text-yellow-500" />
    return <AlertTriangle className="h-6 w-6 text-red-500" />
  }

  // Calculate normalized score from 0-100 (lower is better)
  const normalizeScore = (score: number, maxScore: number = 100) => {
    // Ensure score is between 0-100
    return Math.min(100, Math.max(0, (score / maxScore) * 100));
  }

  // Function to get mental health condition from score (lower score = better condition)
  const getMentalHealthCondition = (score: number) => {
    if (score <= 25) return "Healthy";
    if (score <= 50) return "Mild";
    if (score <= 75) return "Moderate";
    return "Severe";
  }

  // Calculate wellbeing score (inverse of percentage)
  const calculateWellbeingScore = (resultsData: any) => {
    try {
      // Log initial state
      console.log("Calculating wellbeing score with results:", resultsData);
      
      // Return default if no results
      if (!resultsData) {
        console.log("No results available, returning default score");
        return 50;
      }
      
      // Get individual scores with validation
      const rawScores: { [key: string]: number } = {
        stress: Number(resultsData.stress_percentage || resultsData.stress || 50),
        anxiety: Number(resultsData.anxiety_percentage || resultsData.anxiety || 50),
        depression: Number(resultsData.depression_percentage || resultsData.depression || 50)
      };
      
      // Log raw scores before validation
      console.log("Raw scores before validation:", rawScores);
      
      // Validate each score and replace NaN with default
      Object.keys(rawScores).forEach(key => {
        if (isNaN(rawScores[key])) {
          console.warn(`${key} score is NaN, using default value`);
          rawScores[key] = 50;
        }
      });
      
      // Ensure scores are within 0-100 range
      const validatedScores = {
        stress: Math.min(100, Math.max(0, rawScores.stress)),
        anxiety: Math.min(100, Math.max(0, rawScores.anxiety)),
        depression: Math.min(100, Math.max(0, rawScores.depression))
      };
      
      console.log("Validated scores:", validatedScores);
      
      // Calculate the average score
      const totalScore = validatedScores.stress + validatedScores.anxiety + validatedScores.depression;
      const averageScore = totalScore / 3;
      
      // Calculate wellbeing score (inverse of the average)
      // Lower mental health issue scores = higher wellbeing
      const score = Math.min(100, Math.max(0, Math.round(100 - averageScore)));
      
      console.log("Final calculation:", {
        totalScore,
        averageScore,
        wellbeingScore: score
      });
      
      return score;
      
    } catch (error) {
      console.error("Error calculating wellbeing score:", error);
      return 50; // Default score on error
    }
  };

  // Load assessment results from localStorage or URL parameters
  useEffect(() => {
    try {
      // First try to clear any browser caches for MindWell data if our helper is defined
      if (typeof window !== 'undefined' && window.clearMindWellCache) {
        window.clearMindWellCache();
      }
      
      console.log("Loading assessment results...");
      let hasValidResults = false;
      
      // Try to get results from URL parameters first
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const percentageFromUrl = urlParams.get('percentage');
        const stressFromUrl = urlParams.get('stress_percentage') || urlParams.get('stress');
        const anxietyFromUrl = urlParams.get('anxiety_percentage') || urlParams.get('anxiety');
        const depressionFromUrl = urlParams.get('depression_percentage') || urlParams.get('depression');
        
        if (percentageFromUrl || stressFromUrl || anxietyFromUrl || depressionFromUrl) {
          console.log("Found results in URL parameters");
          hasValidResults = true;
          
          // Build results object from URL parameters
          const resultsFromUrl = {
            percentage: Math.min(100, Math.max(0, Number(percentageFromUrl) || 50)),
            stress: Math.min(100, Math.max(0, Number(stressFromUrl) || 50)),
            anxiety: Math.min(100, Math.max(0, Number(anxietyFromUrl) || 50)),
            depression: Math.min(100, Math.max(0, Number(depressionFromUrl) || 50)),
            timestamp: new Date().toISOString(),
            fromUrl: true,
            fromStorage: false
          };
          
          console.log("Results from URL:", resultsFromUrl);
          
          // Save these results to localStorage for future use
          localStorage.setItem("mindwell_assessment_results", JSON.stringify(resultsFromUrl));
          sessionStorage.setItem("mindwell_assessment_results", JSON.stringify(resultsFromUrl));
          
          // Use these results
          setResults(resultsFromUrl);
          
          // Calculate wellbeing score
          const calculatedScore = calculateWellbeingScore(resultsFromUrl);
          setWellbeingScore(calculatedScore);
        }
      }
      
      // If no URL parameters, try localStorage
      const savedResults = localStorage.getItem("mindwell_assessment_results");
      
      console.log("Checking localStorage for results:", savedResults ? "Found" : "Not found");
      
      if (savedResults && (!results || !results.fromUrl)) {
        try {
          const parsedResults = JSON.parse(savedResults);
          console.log("Parsed assessment results:", parsedResults);
          hasValidResults = true;
          
          // Validate and sanitize scores
          const sanitizedResults = {
            ...parsedResults,
            stress: Math.min(100, Math.max(0, Number(parsedResults.stress) || 50)),
            anxiety: Math.min(100, Math.max(0, Number(parsedResults.anxiety) || 50)),
            depression: Math.min(100, Math.max(0, Number(parsedResults.depression) || 50)),
            percentage: Math.min(100, Math.max(0, Number(parsedResults.percentage) || 50)),
            fromStorage: true,
            fromUrl: false
          };
          
          // Verify all scores are valid numbers
          const scores = ['stress', 'anxiety', 'depression', 'percentage'];
          scores.forEach(score => {
            if (typeof sanitizedResults[score] !== 'number' || isNaN(sanitizedResults[score])) {
              console.warn(`Invalid ${score} score, using default:`, sanitizedResults[score]);
              sanitizedResults[score] = 50;
            }
          });
          
          console.log("Sanitized results:", sanitizedResults);
          setResults(sanitizedResults);
          
          // Calculate wellbeing score after setting results
          const calculatedScore = calculateWellbeingScore(sanitizedResults);
          setWellbeingScore(calculatedScore);
        } catch (parseError) {
          console.error("Error parsing assessment results:", parseError);
          
          // Try backup from sessionStorage
          const sessionResults = sessionStorage.getItem("mindwell_assessment_results");
          if (sessionResults) {
            try {
              const parsedSessionResults = JSON.parse(sessionResults);
              console.log("Using session storage backup:", parsedSessionResults);
              hasValidResults = true;
              
              // Add source tracking if not present
              const sessionResultsWithSource = {
                ...parsedSessionResults,
                fromStorage: true,
                fromUrl: false,
                fromSession: true
              };
              
              setResults(sessionResultsWithSource);
            
              // Calculate wellbeing score
              const calculatedScore = calculateWellbeingScore(parsedSessionResults);
              setWellbeingScore(calculatedScore);
            } catch (sessionError) {
              console.error("Error parsing session results:", sessionError);
              // Use default values
              setResults({
                stress: 50,
                anxiety: 50,
                depression: 50,
                percentage: 50,
                timestamp: new Date().toISOString(),
                fromStorage: false,
                fromUrl: false,
                isDefault: true
              });
              setWellbeingScore(50);
            }
          }
        }
      } else if (!results && !hasValidResults) {
        // No valid results found, redirect to assessment page
        console.warn("No valid assessment results found, redirecting to assessment page");
        
        if (typeof window !== 'undefined') {
          // Check if we're not in an infinite redirect loop
          const isRedirecting = sessionStorage.getItem("mindwell_redirecting_to_assessment");
          if (!isRedirecting) {
            sessionStorage.setItem("mindwell_redirecting_to_assessment", "true");
            window.location.href = "/assessment";
            return;
          }
        }
        
        // Fallback to default values if can't redirect
        setResults({
          stress: 50,
          anxiety: 50,
          depression: 50,
          percentage: 50,
          timestamp: new Date().toISOString(),
          fromStorage: false,
          fromUrl: false,
          isDefault: true
        });
        setWellbeingScore(50);
      }
      
      // Clear redirect flag
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem("mindwell_redirecting_to_assessment");
      }
      
      // Load user data from both user and user_data sources
      // Try user_data first (more specific for assessment)
      const userDataStr = localStorage.getItem("mindwell_user_data");
      if (userDataStr) {
        try {
          const parsedUserData = JSON.parse(userDataStr);
          setUserData(parsedUserData);
          console.log("Loaded user data from mindwell_user_data:", parsedUserData);
        } catch (parseError) {
          console.error("Error parsing user_data:", parseError);
        }
      }
      
      // Fall back to auth user data if needed or merge with existing data
      const authUserStr = localStorage.getItem("mindwell_user");
      if (authUserStr) {
        try {
          const authUser = JSON.parse(authUserStr);
          console.log("Found auth user data:", authUser);
          
          // If we already have user data, merge it with auth data for completeness
          if (userData) {
            const mergedData = {
              ...userData,
              name: userData.name || authUser.name || "",
              age: userData.age || authUser.age || "",
              gender: userData.gender || authUser.gender || "",
              email: userData.email || authUser.email || "",
              occupation: userData.occupation || authUser.occupation || "",
              location: userData.location || authUser.location || ""
            };
            setUserData(mergedData);
            console.log("Merged user data:", mergedData);
            
            // Update localStorage with merged data
            localStorage.setItem("mindwell_user_data", JSON.stringify(mergedData));
          } else {
            // No existing user data, use auth data
            setUserData(authUser);
            console.log("Using auth user data:", authUser);
            
            // Save to user_data for future use
            localStorage.setItem("mindwell_user_data", JSON.stringify(authUser));
          }
        } catch (parseError) {
          console.error("Error parsing auth user data:", parseError);
        }
      }

      // Simulate loading data
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 800);

      return () => clearTimeout(timer);
    } catch (error) {
      console.error("Error loading assessment results:", error);
      setIsLoading(false);
    }
  }, []);

  // Initialize GSAP animations after loading
  useEffect(() => {
    if (!isLoading && results) {
      // Simplified animations with fewer elements and effects
      if (mainScoreRef.current) {
        gsap.fromTo(
          mainScoreRef.current, 
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5 }
        );
      }
      
      // Only animate the essential score cards with simplified animations
      const cardRefs = [stressCardRef.current, anxietyCardRef.current, depressionCardRef.current].filter(Boolean);
      gsap.fromTo(
        cardRefs,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.5 }
      );
      
      // Simplify progress animations
      gsap.fromTo(
        ".progress-fill",
        { width: 0 },
        { 
          width: function(index) {
            const levels = [
              `${Math.min(100, results?.stress || 50)}%`,
              `${Math.min(100, results?.anxiety || 50)}%`,
              `${Math.min(100, results?.depression || 50)}%`
            ];
            return levels[index];
          },
          duration: 1,
          ease: "power2.out"
        }
      );
      
      // Skip ScrollTrigger animations and other complex animations
      if (actionsRef.current) {
        gsap.fromTo(
          actionsRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.5 }
        );
      }
      
      // Remove hover animations that cause repaints
      return () => {
        if (cardRefs.length) {
          gsap.killTweensOf(cardRefs);
        }
        if (mainScoreRef.current) {
          gsap.killTweensOf(mainScoreRef.current);
        }
        gsap.killTweensOf(".progress-fill");
        if (actionsRef.current) {
          gsap.killTweensOf(actionsRef.current);
        }
      };
    }
  }, [isLoading, results]);

  // Get recommendations based on scores
  const getRecommendations = () => {
    try {
      if (!results) return [];
      
      const stressScore = Number(results.stress) || 50;
      const anxietyScore = Number(results.anxiety) || 50;
      const depressionScore = Number(results.depression) || 50;
      
      const recommendations = [];
      
      // General recommendation for all users
      recommendations.push({
        title: "Daily Mindfulness Practice",
        description: "Spend 5-10 minutes each day practicing mindfulness meditation to reduce stress and improve mental clarity.",
        icon: <Brain className="h-5 w-5" />
      });
      
      // Add recommendations based on scores
      if (stressScore > 50) {
        recommendations.push({
          title: "Stress Management Techniques",
          description: "Practice deep breathing exercises, progressive muscle relaxation, or try our relaxation games to reduce stress levels.",
          icon: <RefreshCw className="h-5 w-5" />,
          action: {
            label: "Try Relaxation Activities",
            link: "/relaxation"
          }
        });
      }
      
      if (anxietyScore > 50) {
        recommendations.push({
          title: "Anxiety Reduction Strategies",
          description: "Consider cognitive-behavioral techniques, journaling, or guided meditation to manage anxiety symptoms.",
          icon: <Sparkles className="h-5 w-5" />
        });
      }
      
      if (depressionScore > 50) {
        recommendations.push({
          title: "Mood Enhancement Activities",
          description: "Engage in regular physical activity, maintain social connections, and establish a consistent daily routine.",
          icon: <Heart className="h-5 w-5" />
        });
      }
      
      return recommendations;
    } catch (error) {
      console.error("Error generating recommendations:", error);
      return [];
    }
  };
  
  // Function to get interpretation text based on score
  const getInterpretationText = (score: number) => {
    if (score <= 25) return "Excellent";
    if (score <= 50) return "Good";
    if (score <= 75) return "Moderate";
    return "Needs Attention";
  };

  // Function to generate PDF report
  const generatePDF = async () => {
    if (!results) return;
    
    setIsPdfGenerating(true);
    
    try {
      // Create a canvas element
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }

      // A4 dimensions in pixels (assuming 96 DPI)
      const mmToPx = 3.779528; // 1mm = 3.779528px at 96 DPI
      const pageWidth = 210 * mmToPx;  // A4 width in pixels
      const pageHeight = 297 * mmToPx; // A4 height in pixels
      const margin = 25 * mmToPx;      // 25mm margins
      
      // Set canvas size to A4
      canvas.width = pageWidth;
      canvas.height = pageHeight;
      
      // Fill background white
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, pageWidth, pageHeight);
      
      // Load professional fonts
      await document.fonts.load('bold 32px "Segoe UI"');
      await document.fonts.load('normal 16px "Segoe UI"');
      await document.fonts.load('bold 18px "Segoe UI"');
      await document.fonts.load('normal 14px "Segoe UI"');
      await document.fonts.load('normal 12px "Segoe UI"');
      
      // Constants
      const contentWidth = pageWidth - (2 * margin);
      const colors = {
        purple: '#9b59b6',      // Title and section headers color
        headerBg: '#9b59b6',    // Table header background
        white: '#ffffff',
        black: '#000000',
        gray: '#888888',
        lightGray: '#cccccc'    // Table borders
      };
      
      let yPos = margin;
      
      // Helper function to draw rounded rectangle
      const drawRoundedRect = (x: number, y: number, width: number, height: number, radius: number) => {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
      };

      // Helper function to draw table
      const drawTable = (headers: string[], data: string[][], startY: number, headerBgColor: string) => {
        const rowHeight = 45;    // Row height
        const headerHeight = 50; // Header height
        const cellPadding = 25;  // Increased padding
        const borderRadius = 4;
        const tableWidth = contentWidth;
        const columnWidths = [
          tableWidth * 0.4,  // 40% for Field/Measure column
          tableWidth * 0.6   // 60% for Value/Score column
        ];
        
        // Draw outer table border with radius only on top corners
        ctx.strokeStyle = colors.lightGray;
        ctx.lineWidth = 1;
        ctx.beginPath();
        // Top left corner
        ctx.moveTo(margin, startY + borderRadius);
        ctx.quadraticCurveTo(margin, startY, margin + borderRadius, startY);
        // Top edge
        ctx.lineTo(margin + tableWidth - borderRadius, startY);
        // Top right corner
        ctx.quadraticCurveTo(margin + tableWidth, startY, margin + tableWidth, startY + borderRadius);
        // Right edge
        ctx.lineTo(margin + tableWidth, startY + headerHeight + (data.length * rowHeight));
        // Bottom edge
        ctx.lineTo(margin, startY + headerHeight + (data.length * rowHeight));
        // Left edge
        ctx.lineTo(margin, startY + borderRadius);
        ctx.stroke();
        
        // Draw header background
        ctx.fillStyle = headerBgColor;
        ctx.beginPath();
        ctx.moveTo(margin, startY + borderRadius);
        ctx.quadraticCurveTo(margin, startY, margin + borderRadius, startY);
        ctx.lineTo(margin + tableWidth - borderRadius, startY);
        ctx.quadraticCurveTo(margin + tableWidth, startY, margin + tableWidth, startY + borderRadius);
        ctx.lineTo(margin + tableWidth, startY + headerHeight);
        ctx.lineTo(margin, startY + headerHeight);
        ctx.closePath();
        ctx.fill();
        
        // Draw header text
        ctx.fillStyle = colors.white;
        ctx.font = 'bold 16px "Segoe UI"';
        headers.forEach((header, index) => {
          ctx.textAlign = 'left';
          const x = margin + cellPadding + (index === 0 ? 0 : columnWidths[0]);
          ctx.fillText(header, x, startY + 32);
        });
        
        // Draw vertical line in header
        ctx.strokeStyle = colors.white;
        ctx.beginPath();
        ctx.moveTo(margin + columnWidths[0], startY);
        ctx.lineTo(margin + columnWidths[0], startY + headerHeight);
        ctx.stroke();
        
        // Draw rows
        data.forEach((row, rowIndex) => {
          const y = startY + headerHeight + (rowIndex * rowHeight);
          
          // Draw horizontal line
          ctx.strokeStyle = colors.lightGray;
          ctx.beginPath();
          ctx.moveTo(margin, y);
          ctx.lineTo(margin + tableWidth, y);
          ctx.stroke();
          
          // Draw vertical line
          ctx.beginPath();
          ctx.moveTo(margin + columnWidths[0], y);
          ctx.lineTo(margin + columnWidths[0], y + rowHeight);
          ctx.stroke();
          
          // Row text
          ctx.fillStyle = colors.black;
          ctx.font = 'normal 14px "Segoe UI"';
          
          // First column (left-aligned)
          ctx.textAlign = 'left';
          ctx.fillText(row[0], margin + cellPadding, y + 30);
          
          // Second column (left-aligned with padding)
          ctx.fillText(row[1], margin + columnWidths[0] + cellPadding, y + 30);
        });
        
        return startY + headerHeight + (data.length * rowHeight);
      };

      // Title Section
      ctx.fillStyle = colors.purple;
      ctx.font = 'bold 32px "Segoe UI"';
      ctx.textAlign = 'center';
      ctx.fillText('MindWell Assessment Report', pageWidth / 2, yPos + 40);
      
      ctx.font = 'normal 14px "Segoe UI"';
      ctx.fillStyle = colors.gray;
      ctx.fillText(`Generated on: ${format(new Date(), "MMMM d, yyyy")}`, pageWidth / 2, yPos + 70);
      
      yPos += 100;

      // Patient Information Section
      ctx.fillStyle = colors.purple;
      ctx.font = 'bold 18px "Segoe UI"';
      ctx.textAlign = 'left';
      ctx.fillText('Personal Information', margin, yPos);
      yPos += 30;

      // Patient Info Table
      const patientHeaders = ['Field', 'Value'];
      const patientData = [
        ['Name', userData?.name || 'Not provided'],
        ['Age', userData?.age || 'Not provided'],
        ['Gender', userData?.gender || 'Not provided'],
        ['Occupation', userData?.occupation || 'Not provided'],
        ['Email', userData?.email || 'Not provided'],
        ['Location', userData?.location || 'Not provided'],
        ['Report ID', `MW${Date.now().toString().slice(-6)}`]
      ];
      
      yPos = drawTable(patientHeaders, patientData, yPos, colors.headerBg);
      yPos += 40;

      // Assessment Results Section
      ctx.fillStyle = colors.purple;
      ctx.font = 'bold 18px "Segoe UI"';
      ctx.textAlign = 'left';
      ctx.fillText('Assessment Results', margin, yPos);
      yPos += 30;

      // Results Table
      const resultsHeaders = ['Measure', 'Score'];
      const resultsData = [
        ['Overall Wellbeing', `${wellbeingScore.toFixed(0)}%`],
        ['Stress Level', `${results.stress ? Math.min(100, results.stress).toFixed(0) : "N/A"}%`],
        ['Anxiety Level', `${results.anxiety ? Math.min(100, results.anxiety).toFixed(0) : "N/A"}%`],
        ['Depression Level', `${results.depression ? Math.min(100, results.depression).toFixed(0) : "N/A"}%`]
      ];
      
      yPos = drawTable(resultsHeaders, resultsData, yPos, colors.headerBg);
      yPos += 40;

      // Disclaimer Section
      ctx.fillStyle = colors.purple;
      drawRoundedRect(margin, yPos, contentWidth, 50, 4);
      ctx.fill();
      
      ctx.fillStyle = colors.white;
      ctx.font = 'bold 16px "Segoe UI"';
      ctx.textAlign = 'left';
      ctx.fillText('Disclaimer', margin + 20, yPos + 32);
      
      yPos += 70;

      // Disclaimer Text with better formatting
      ctx.fillStyle = colors.gray;
      ctx.font = 'normal 13px "Segoe UI"';
      ctx.textAlign = 'left';
      const disclaimer = "This assessment is not a clinical diagnosis. The results are based on your responses and should be used as a general guide to your mental wellbeing. Please consult with a healthcare professional for proper evaluation and treatment.";
      
      // Word wrap for disclaimer with better spacing
      const maxWidth = contentWidth - 40;
      const words = disclaimer.split(' ');
      let line = '';
      let testLine = '';
      let lineHeight = 20;
      let disclaimerY = yPos;
      let lastY = disclaimerY; // Track the last line's Y position
      
      words.forEach(word => {
        testLine = line + word + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth) {
          ctx.fillText(line, margin + 20, disclaimerY);
          line = word + ' ';
          disclaimerY += lineHeight;
          lastY = disclaimerY;
        } else {
          line = testLine;
        }
      });
      ctx.fillText(line, margin + 20, disclaimerY);
      lastY = disclaimerY;

      // Footer - positioned relative to the last line of disclaimer
      ctx.fillStyle = colors.gray;
      ctx.font = 'normal 12px "Segoe UI"';
      ctx.textAlign = 'center';
      ctx.fillText(
        `MindWell Assessment - ${format(new Date(), "MMMM d, yyyy")}`,
        pageWidth / 2,
        lastY + 60 // Add more space after disclaimer
      );

      // Create PDF from canvas
      const pdf = new jsPDF({
        format: 'a4',
        unit: 'mm',
        orientation: 'portrait'
      });

      // Add canvas as image to PDF with high quality
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);

      // Save the PDF
      const fileName = userData?.name 
        ? `mindwell-assessment-${userData.name.toLowerCase().replace(/\s+/g, '-')}.pdf`
        : "mindwell-assessment-report.pdf";
      
      pdf.save(fileName);
      
      toast({
        title: "Success",
        description: "Your assessment report has been downloaded.",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsPdfGenerating(false);
    }
  };
  
  // Add a cache clearing function to the window object for future use
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.clearMindWellCache = () => {
        try {
          console.log("Clearing MindWell cache...");
          // Clear assessment-related data but keep user data
          localStorage.removeItem("mindwell_assessment_results");
          sessionStorage.removeItem("mindwell_assessment_results");
          return true;
        } catch (e) {
          console.error("Error clearing MindWell cache:", e);
          return false;
        }
      };
    }
    
    return () => {
      // Clean up when component unmounts
      if (typeof window !== 'undefined') {
        delete window.clearMindWellCache;
      }
    };
  }, []);

  // Function to handle retaking the assessment
  const handleRetakeAssessment = () => {
    // Clear assessment data
    if (typeof window !== 'undefined') {
      if (window.clearMindWellCache) {
        window.clearMindWellCache();
      } else {
        localStorage.removeItem("mindwell_assessment_results");
        sessionStorage.removeItem("mindwell_assessment_results");
      }
    }
    
    // Redirect to assessment page
    window.location.href = "/assessment";
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
            <p className="text-lg text-gray-600 dark:text-gray-300">Loading your assessment results...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }
  
  // No results found
  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex flex-col">
        <Navbar />
        <div className="flex-1 container max-w-4xl mx-auto px-4 py-8 flex flex-col items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>No Assessment Results</CardTitle>
              <CardDescription>We couldn't find any assessment results for you.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                Please complete an assessment to view your results.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/assessment" className="w-full">
                <Button className="w-full">Take Assessment</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
        <Footer />
      </div>
    )
  }
  
  // Main report view
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex flex-col" ref={reportRef}>
      <Navbar />
      
      <main className="flex-1 container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8 max-w-full md:max-w-5xl">
        {/* Main Title Area - Responsive Adjustments */}
        <div className="text-center mb-6 sm:mb-8 md:mb-10">
          <div className="relative inline-block">
            <div className="absolute -top-6 -left-6 w-8 h-8 sm:w-12 sm:h-12 bg-purple-200 dark:bg-purple-900/30 rounded-full blur-xl opacity-70"></div>
            <div className="absolute -bottom-6 -right-6 w-8 h-8 sm:w-12 sm:h-12 bg-indigo-200 dark:bg-indigo-900/30 rounded-full blur-xl opacity-70"></div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 mb-2 relative z-10">
              Your Mental Health Report
            </h1>
          </div>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-3 max-w-2xl mx-auto px-2">
            Comprehensive analysis of your mental wellbeing based on your assessment
          </p>
          <div className="inline-flex items-center justify-center gap-2 bg-purple-50 dark:bg-purple-900/20 px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm text-purple-700 dark:text-purple-300 border border-purple-100 dark:border-purple-800">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 sm:h-4 sm:w-4">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
              <line x1="16" x2="16" y1="2" y2="6"></line>
              <line x1="8" x2="8" y1="2" y2="6"></line>
              <line x1="3" x2="21" y1="10" y2="10"></line>
            </svg>
            Assessment completed on {results.timestamp ? format(new Date(results.timestamp), "MMMM d, yyyy") : format(new Date(), "MMMM d, yyyy")}
          </div>
        </div>
        
        {/* Overall Wellbeing Score Card - Responsive Adjustments */}
        <div ref={mainScoreRef} className="transform hover:scale-[1.01] transition-transform duration-300">
          <Card className="mb-6 sm:mb-8 overflow-hidden border-0 shadow-xl sm:shadow-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg">
            <div className="bg-gradient-to-r from-purple-600/90 to-indigo-600/90 p-1 sm:p-1.5 backdrop-blur-sm">
              <CardContent className="bg-white/95 dark:bg-gray-900/95 p-4 sm:p-6 md:p-8 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                  <div className="absolute -top-24 -left-24 w-32 sm:w-48 h-32 sm:h-48 bg-purple-500/10 rounded-full blur-3xl"></div>
                  <div className="absolute -bottom-24 -right-24 w-32 sm:w-48 h-32 sm:h-48 bg-indigo-500/10 rounded-full blur-3xl"></div>
                  <div className="absolute top-1/4 right-10 w-3 h-3 sm:w-4 sm:h-4 bg-purple-400/30 rounded-full blur-sm animate-pulse"></div>
                  <div className="absolute bottom-1/4 left-10 w-4 h-4 sm:w-6 sm:h-6 bg-indigo-400/30 rounded-full blur-sm animate-pulse" style={{ animationDelay: "1s" }}></div>
                </div>
                
                <div className="flex flex-col items-center relative z-10">
                  <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
                    <div className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 p-2 sm:p-3 rounded-xl">
                      <Brain className="h-5 w-5 sm:h-7 sm:w-7 md:h-8 md:w-8 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400">
                      Overall Wellbeing Score
                    </h2>
                  </div>
                  
                  <div className="relative mb-6 sm:mb-8 md:mb-10 group" id="wellbeing-score-circle">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div id="score-number" className="text-4xl sm:text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 drop-shadow-sm transition-transform duration-300 transform group-hover:scale-110">
                        {wellbeingScore}%
                      </div>
                    </div>
                    <svg className="w-36 h-36 sm:w-44 sm:h-44 md:w-56 md:h-56 transform transition-transform duration-300 group-hover:scale-105" viewBox="0 0 100 100">
                      {/* Glowing background circle */}
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="45" 
                        fill="none" 
                        className="stroke-purple-100 dark:stroke-purple-900/30"
                        strokeWidth="8"
                        filter="url(#glow)"
                      />
                      {/* Progress circle */}
                      <circle 
                        id="progress-circle"
                        cx="50" 
                        cy="50" 
                        r="45" 
                        fill="none" 
                        stroke="url(#gradient)" 
                        strokeWidth="8"
                        strokeDasharray="283"
                        strokeDashoffset={283 - (wellbeingScore / 100 * 283)}
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                        className="transition-all duration-1000 ease-out"
                        filter="url(#glow)"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" className="text-purple-600" stopColor="currentColor">
                            <animate attributeName="stop-color" 
                              values="#8b5cf6;#6366f1;#8b5cf6" 
                              dur="4s" 
                              repeatCount="indefinite" />
                          </stop>
                          <stop offset="100%" className="text-indigo-600" stopColor="currentColor">
                            <animate attributeName="stop-color" 
                              values="#6366f1;#8b5cf6;#6366f1" 
                              dur="4s" 
                              repeatCount="indefinite" />
                          </stop>
                        </linearGradient>
                        <filter id="glow">
                          <feGaussianBlur stdDeviation="2" result="blur" />
                          <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                      </defs>
                    </svg>
                  </div>
                  
                  <div id="wellbeing-score-text" className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 md:mb-8 bg-gradient-to-r from-purple-100/80 to-indigo-100/80 dark:from-purple-900/30 dark:to-indigo-900/30 px-4 py-2 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl backdrop-blur-sm border border-purple-200/50 dark:border-purple-800/50 transform hover:scale-105 transition-all duration-300">
                    {getScoreIcon(100 - wellbeingScore)}
                    <span className={`font-bold text-lg sm:text-xl ${getScoreLevel(100 - wellbeingScore).color}`}>
                      {getScoreLevel(100 - wellbeingScore).text}
                    </span>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50/90 to-indigo-50/90 dark:from-purple-900/20 dark:to-indigo-900/20 p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl border border-purple-100/50 dark:border-purple-800/50 backdrop-blur-sm flex items-start gap-3 sm:gap-4 transform hover:scale-[1.01] transition-all duration-300">
                    <div className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                      <Heart className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                      {wellbeingScore < 40 ? 
                        "We've noticed some areas that may need attention. The recommendations below can help improve your mental wellbeing." :
                        "You're doing well! Continue with the positive practices and check out our recommendations to maintain your mental wellbeing."
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        </div>
        
        {/* Individual Scores Section - Responsive Grid */}
        <div className="mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 mb-4 sm:mb-6 md:mb-8 pb-2 border-b border-purple-100 dark:border-purple-800">
            Mental Health Analysis
          </h2>
        
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {/* Stress Card */}
            <div ref={stressCardRef} className="transform hover:scale-105 transition-all duration-300">
              <Card className="overflow-hidden border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg">
                <CardHeader className="bg-gradient-to-r from-blue-500/90 to-blue-600/90 p-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-blue-600/10 backdrop-blur-sm"></div>
                  <CardTitle className="text-white text-xl flex items-center gap-3 relative z-10">
                    <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                      <FileText className="h-5 w-5" />
                    </div>
                    Stress Level
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="mb-6">
                    <div className="flex justify-between mb-3">
                      <span className="font-bold text-4xl bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500">
                        {results?.stress ? Math.min(100, Math.round(results.stress)).toString() : "50"}%
                      </span>
                      <span className={`text-md font-semibold ${getScoreLevel(results?.stress || 50).color} px-4 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800`}>
                        {getMentalHealthCondition(results?.stress || 50)}
                      </span>
                    </div>
                    <div className="w-full h-4 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden relative progress-track">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 progress-fill relative group"
                        style={{ width: `${Math.min(100, results?.stress || 50)}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute top-0 right-0 h-full w-3 bg-blue-300/50 blur-sm"></div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Common Symptoms:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400 symptom-item">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                        Feeling overwhelmed
                      </li>
                      <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400 symptom-item">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                        Irritability or restlessness
                      </li>
                      <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400 symptom-item">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                        Muscle tension or headaches
                      </li>
                    </ul>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {results?.stress && results.stress > 60 ? 
                        "Consider stress reduction techniques like meditation and deep breathing." :
                        "You're managing stress well. Continue your current practices."
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Anxiety Card */}
            <div ref={anxietyCardRef} className="transform hover:scale-105 transition-all duration-300">
              <Card className="overflow-hidden border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg">
                <CardHeader className="bg-gradient-to-r from-purple-500/90 to-purple-600/90 p-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-purple-600/10 backdrop-blur-sm"></div>
                  <CardTitle className="text-white text-xl flex items-center gap-3 relative z-10">
                    <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                        <path d="m9 12 2 2 4-4"></path>
                      </svg>
                    </div>
                    Anxiety Level
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="mb-6">
                    <div className="flex justify-between mb-3">
                      <span className="font-bold text-4xl bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-purple-600 dark:from-purple-400 dark:to-purple-500">
                        {results?.anxiety ? Math.min(100, Math.round(results.anxiety)).toString() : "50"}%
                      </span>
                      <span className={`text-md font-semibold ${getScoreLevel(results?.anxiety || 50).color} px-4 py-1 rounded-full bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800`}>
                        {getMentalHealthCondition(results?.anxiety || 50)}
                      </span>
                    </div>
                    <div className="w-full h-4 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden relative progress-track">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-purple-500 to-purple-600 progress-fill relative group"
                        style={{ width: `${Math.min(100, results?.anxiety || 50)}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute top-0 right-0 h-full w-3 bg-purple-300/50 blur-sm"></div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Common Symptoms:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400 symptom-item">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                        Excessive worry
                      </li>
                      <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400 symptom-item">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                        Restlessness or feeling on edge
                      </li>
                      <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400 symptom-item">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                        Racing heart or difficulty breathing
                      </li>
                    </ul>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {results?.anxiety && results.anxiety > 60 ? 
                        "Try mindfulness exercises and consider limiting caffeine intake." :
                        "Your anxiety levels are manageable. Continue your positive habits."
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Depression Card */}
            <div ref={depressionCardRef} className="transform hover:scale-105 transition-all duration-300">
              <Card className="overflow-hidden border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg">
                <CardHeader className="bg-gradient-to-r from-indigo-500/90 to-indigo-600/90 p-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-indigo-600/10 backdrop-blur-sm"></div>
                  <CardTitle className="text-white text-xl flex items-center gap-3 relative z-10">
                    <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </div>
                    Depression Level
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="mb-6">
                    <div className="flex justify-between mb-3">
                      <span className="font-bold text-4xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-indigo-600 dark:from-indigo-400 dark:to-indigo-500">
                        {results?.depression ? Math.min(100, Math.round(results.depression)).toString() : "50"}%
                      </span>
                      <span className={`text-md font-semibold ${getScoreLevel(results?.depression || 50).color} px-4 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800`}>
                        {getMentalHealthCondition(results?.depression || 50)}
                      </span>
                    </div>
                    <div className="w-full h-4 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden relative progress-track">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 progress-fill relative group"
                        style={{ width: `${Math.min(100, results?.depression || 50)}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute top-0 right-0 h-full w-3 bg-indigo-300/50 blur-sm"></div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Common Symptoms:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400 symptom-item">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                        Persistent sadness
                      </li>
                      <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400 symptom-item">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                        Loss of interest in activities
                      </li>
                      <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400 symptom-item">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                        Fatigue or low energy
                      </li>
                    </ul>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {results?.depression && results.depression > 60 ? 
                        "Regular exercise and social connections can help improve mood." :
                        "You're maintaining good emotional health. Keep up the good work."
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
        {/* Personalized Recommendations Section */}
        <div ref={recommendationsRef} className="mt-10 space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-purple-600" /> 
              Personalized Recommendations
            </h2>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Based on your assessment results
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {getRecommendations().map((recommendation, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-lg transition-all duration-300 border border-purple-100/50 dark:border-purple-800/50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-900/30 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/50 transition-colors duration-300">
                      {recommendation.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg mb-2 text-gray-900 dark:text-gray-100">
                        {recommendation.title}
                      </CardTitle>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {recommendation.description}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                {recommendation.action && (
                  <CardFooter className="pt-0">
                    <Button 
                      variant="outline" 
                      className="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200 
                               dark:bg-purple-900/20 dark:hover:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800/50
                               transition-all duration-300"
                      asChild
                    >
                      <Link href={recommendation.action.link}>
                        <span className="flex items-center justify-center gap-2">
                          {recommendation.action.label}
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </span>
                      </Link>
                    </Button>
                  </CardFooter>
                )}
              </Card>
            ))}
          </div>
        </div>
        
        {/* Sleek Modern Action Buttons - Subtle Container & Active Animations */}
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 md:gap-5 justify-center mb-8 mt-8 max-w-5xl mx-auto">
          {/* Button 1: Download PDF Report - Primary Gradient Button */}
          <button 
            onClick={generatePDF}
            disabled={isPdfGenerating}
            className="relative w-full sm:w-auto bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 text-white text-sm md:text-base font-medium px-4 py-3 md:px-5 md:py-3 rounded-lg min-w-0 sm:min-w-[180px] shadow-[0_0_15px_rgba(139,92,246,0.5)] transform transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_25px_rgba(139,92,246,0.6)] active:translate-y-1 active:shadow-[0_0_10px_rgba(139,92,246,0.4)] overflow-hidden group flex items-center justify-center gap-2 border border-purple-400/20"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-500/10 to-indigo-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            {isPdfGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="relative z-10 text-sm whitespace-nowrap">Generating...</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 md:h-5 md:w-5 group-hover:animate-bounce">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                <span className="relative z-10 text-sm md:text-base whitespace-nowrap">Download PDF</span>
              </>
            )}
          </button>
          
          {/* Button 2: Conditional - Either Go Profile or Try Relaxation Activities */}
          {wellbeingScore >= 60 ? (
            <a href="/profile" className="w-full sm:w-auto">
              <button 
                className="relative w-full bg-gray-900/40 dark:bg-gray-800/80 backdrop-blur-sm border border-purple-500/50 hover:border-purple-400 text-white text-sm md:text-base font-medium px-4 py-3 md:px-5 md:py-3 rounded-lg min-w-0 sm:min-w-[160px] shadow-[0_0_10px_rgba(139,92,246,0.2)] transform transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] active:translate-y-1 active:shadow-[0_0_5px_rgba(139,92,246,0.2)] overflow-hidden group flex items-center justify-center gap-2"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-500/5 to-indigo-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 md:h-5 md:w-5 text-purple-400 group-hover:translate-x-1 transition-transform duration-300">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
                <span className="relative z-10 text-sm md:text-base whitespace-nowrap">Go Profile</span>
              </button>
            </a>
          ) : (
            <a href="/relaxation" className="w-full sm:w-auto">
              <button 
                className="relative w-full bg-gray-900/40 dark:bg-gray-800/80 backdrop-blur-sm border border-purple-500/50 hover:border-purple-400 text-white text-sm md:text-base font-medium px-4 py-3 md:px-5 md:py-3 rounded-lg min-w-0 sm:min-w-[160px] shadow-[0_0_10px_rgba(139,92,246,0.2)] transform transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] active:translate-y-1 active:shadow-[0_0_5px_rgba(139,92,246,0.2)] overflow-hidden group flex items-center justify-center gap-2"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-500/5 to-indigo-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 md:h-5 md:w-5 text-purple-400 group-hover:animate-pulse">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                </svg>
                <span className="relative z-10 text-sm md:text-base whitespace-nowrap">Relaxation</span>
              </button>
            </a>
          )}
          
          {/* Button 3: Retake Assessment */}
            <button 
            onClick={handleRetakeAssessment}
            className="relative w-full sm:w-auto bg-gray-900/40 dark:bg-gray-800/80 backdrop-blur-sm border border-purple-500/50 hover:border-purple-400 text-white text-sm md:text-base font-medium px-4 py-3 md:px-5 md:py-3 rounded-lg min-w-0 sm:min-w-[160px] shadow-[0_0_10px_rgba(139,92,246,0.2)] transform transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] active:translate-y-1 active:shadow-[0_0_5px_rgba(139,92,246,0.2)] overflow-hidden group flex items-center justify-center gap-2"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-500/5 to-indigo-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 md:h-5 md:w-5 text-purple-400 group-hover:rotate-180 transition-transform duration-700">
                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                <path d="M3 3v5h5"></path>
                <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
                <path d="M16 21h5v-5"></path>
              </svg>
              <span className="relative z-10 text-sm md:text-base whitespace-nowrap">Retake</span>
            </button>
        </div>
        
        {/* Important Disclaimer Box - Responsive Adjustments */}
        <div className="rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-900/40 dark:bg-gray-800/40 backdrop-blur-lg p-4 sm:p-5 text-xs sm:text-sm text-gray-300 mb-6 shadow-[0_0_20px_rgba(0,0,0,0.2)] max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="bg-amber-900/30 p-2 sm:p-3 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.2)]">
              <Info className="h-5 w-5 text-amber-400" />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="font-semibold text-white text-base mb-1 sm:mb-2">Disclaimer</h3>
              <p className="text-gray-300 leading-relaxed">
                This assessment is not a clinical diagnosis. The results are based on your responses and should be used as a general guide to your mental wellbeing. Please consult with a healthcare professional for proper evaluation and treatment.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
 