"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

// ==========================================
// TYPE DEFINITIONS FOR MOCK STATE
// ==========================================
interface FoodDonation {
  foodName: string;
  category: string;
  quantity: string;
  expiryDate: string;
  pickupAddress: string;
  contactNumber: string;
  pickupTime: string;
}

interface HelpRequest {
  recipientName: string;
  needsDescription: string;
  peopleCount: string;
  isUrgent: boolean;
  deliveryAddress: string;
  contactNumber: string;
}

interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

export default function LandingPage() {
  // ==========================================
  // NAVIGATION & MOBILE UI STATE
  // ==========================================
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Monitor scroll for header styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ==========================================
  // AUTHENTICATION STATE & LOGIC
  // ==========================================
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);

  // PROTOTYPE BACKEND HOOK: Authenticate
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthLoading(true);

    // Simulate API Network Request delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // MOCK API SUCCESS RESPONSE
    // ----------------------------------------------------
    // TODO: Replace this block with your actual authentication API call.
    // Example:
    // const res = await fetch('/api/auth', { method: 'POST', body: JSON.stringify({ email, password }) });
    // const data = await res.json();
    // ----------------------------------------------------
    const userDisplayName = authTab === "signup" ? name || "New Member" : "Juan Dela Cruz";
    setCurrentUser({
      name: userDisplayName,
      email: email || "user@example.com",
    });

    setIsAuthLoading(false);
    setIsAuthModalOpen(false);
    // Reset fields
    setEmail("");
    setPassword("");
    setName("");
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  // ==========================================
  // DONATE FOOD STATE & LOGIC (MULTI-STEP)
  // ==========================================
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [donateStep, setDonateStep] = useState(1);
  const [donationForm, setDonationForm] = useState<FoodDonation>({
    foodName: "",
    category: "fresh",
    quantity: "",
    expiryDate: "",
    pickupAddress: "",
    contactNumber: "",
    pickupTime: "",
  });
  const [isDonateLoading, setIsDonateLoading] = useState(false);
  const [donationSuccess, setDonationSuccess] = useState(false);

  // PROTOTYPE BACKEND HOOK: Submit Donation
  const handleDonateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDonateLoading(true);

    // Simulate API Network Request delay
    await new Promise((resolve) => setTimeout(resolve, 1800));

    // MOCK API SUCCESS RESPONSE
    // ----------------------------------------------------
    // TODO: Replace this block with your actual donation storage API call.
    // Example:
    // const res = await fetch('/api/donations', { method: 'POST', body: JSON.stringify(donationForm) });
    // if (res.ok) setDonationSuccess(true);
    // ----------------------------------------------------
    console.log("Saving Donation to database:", donationForm);
    setIsDonateLoading(false);
    setDonationSuccess(true);
  };

  const resetDonationModal = () => {
    setDonateStep(1);
    setDonationForm({
      foodName: "",
      category: "fresh",
      quantity: "",
      expiryDate: "",
      pickupAddress: "",
      contactNumber: "",
      pickupTime: "",
    });
    setDonationSuccess(false);
  };

  // ==========================================
  // REQUEST HELP STATE & LOGIC
  // ==========================================
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [helpForm, setHelpForm] = useState<HelpRequest>({
    recipientName: "",
    needsDescription: "",
    peopleCount: "",
    isUrgent: false,
    deliveryAddress: "",
    contactNumber: "",
  });
  const [isHelpLoading, setIsHelpLoading] = useState(false);
  const [helpSuccess, setHelpSuccess] = useState(false);

  // PROTOTYPE BACKEND HOOK: Submit Help Request
  const handleHelpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsHelpLoading(true);

    // Simulate API Network Request delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // MOCK API SUCCESS RESPONSE
    // ----------------------------------------------------
    // TODO: Replace this block with your actual help request API call.
    // Example:
    // const res = await fetch('/api/help-requests', { method: 'POST', body: JSON.stringify(helpForm) });
    // if (res.ok) setHelpSuccess(true);
    // ----------------------------------------------------
    console.log("Saving Help Request to database:", helpForm);
    setIsHelpLoading(false);
    setHelpSuccess(true);
  };

  const resetHelpModal = () => {
    setHelpForm({
      recipientName: "",
      needsDescription: "",
      peopleCount: "",
      isUrgent: false,
      deliveryAddress: "",
      contactNumber: "",
    });
    setHelpSuccess(false);
  };

  // ==========================================
  // HOW IT WORKS: ACTIVE TAB
  // ==========================================
  const [activeTab, setActiveTab] = useState<"donors" | "volunteers" | "recipients">("donors");

  // ==========================================
  // IMPACT CALCULATOR STATE
  // ==========================================
  const [calcQuantity, setCalcQuantity] = useState("50");
  const mealsSaved = Math.round(parseFloat(calcQuantity || "0") * 1.3);
  const co2Prevented = Math.round(parseFloat(calcQuantity || "0") * 2.5);

  // ==========================================
  // CONTACT STATE & LOGIC
  // ==========================================
  const [contactForm, setContactForm] = useState<ContactMessage>({
    name: "",
    email: "",
    message: "",
  });
  const [isContactLoading, setIsContactLoading] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // PROTOTYPE BACKEND HOOK: Contact message submission
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsContactLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1200));

    // MOCK API SUCCESS
    // ----------------------------------------------------
    // TODO: Replace this block with contact form submission logic (e.g. email backend or DB insert)
    // ----------------------------------------------------
    console.log("Sending Contact message:", contactForm);
    setIsContactLoading(false);
    setContactSubmitted(true);
    setContactForm({ name: "", email: "", message: "" });

    // Clear submission toast after 4s
    setTimeout(() => {
      setContactSubmitted(false);
    }, 4000);
  };

  // ==========================================
  // CHATBOT WIDGET STATE & LOGIC
  // ==========================================
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "bot"; text: string }>>([
    {
      sender: "bot",
      text: "Hi! Welcome to Foosha Food Waste Alliance. How can we help you today?",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);

  const faqQuestions = [
    { q: "How do I donate food?", key: "donate" },
    { q: "Is the food donation safe?", key: "safety" },
    { q: "Who distributes the food?", key: "distribute" },
    { q: "Can I join as a volunteer?", key: "volunteer" },
  ];

  const handleChatQuestionClick = async (question: string, key: string) => {
    // Add user message
    setChatMessages((prev) => [...prev, { sender: "user", text: question }]);
    setIsBotTyping(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    let botResponse = "";
    switch (key) {
      case "donate":
        botResponse =
          "To donate, click the 'Donate Food' button at the top of this page. Fill in details about the surplus food (cooked, fresh, or pantry) and specify a pickup time. We'll coordinate with a volunteer rider!";
        break;
      case "safety":
        botResponse =
          "Safety is our top priority! We strictly accept food within safe consumption limits. Donors must seal items properly and indicate dates/times prepared. Volunteers utilize thermal delivery bags.";
        break;
      case "distribute":
        botResponse =
          "We partner with vetted local community kitchens, shelters, and distribution points who manage direct relief distribution to vulnerable families and individuals.";
        break;
      case "volunteer":
        botResponse =
          "Absolutely! We need riders, kitchen helpers, and admins. Sign up by clicking 'Sign In/Sign Up' and check the 'Volunteer Partner' toggle, or send us a message in the Contact form!";
        break;
      default:
        botResponse = "Thank you for asking. Our team will get back to you shortly!";
    }

    setChatMessages((prev) => [...prev, { sender: "bot", text: botResponse }]);
    setIsBotTyping(false);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setChatMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setChatInput("");
    setIsBotTyping(true);

    await new Promise((resolve) => setTimeout(resolve, 1200));

    let botResponse = "";
    const cleanText = userText.toLowerCase();
    if (cleanText.includes("donate") || cleanText.includes("give")) {
      botResponse = "Great! You can tap 'Donate Food' at the top right to open the multi-step donation modal. Let me know if you face any issues.";
    } else if (cleanText.includes("help") || cleanText.includes("need")) {
      botResponse = "If you or your community need food support, tap the green 'NEED HELP?' button on the home banner to request food assistance.";
    } else if (cleanText.includes("volunteer") || cleanText.includes("rider") || cleanText.includes("join")) {
      botResponse = "We are always welcoming new volunteers! Fill out the contact form below or register an account and we'll reach out to schedule an onboarding session.";
    } else {
      botResponse = "Thank you for reaching out! I've logged your query. Our volunteer admin will reply to your registered contact details shortly.";
    }

    setChatMessages((prev) => [...prev, { sender: "bot", text: botResponse }]);
    setIsBotTyping(false);
  };

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white antialiased">
      {/* ==========================================
          1. HEADER / NAVIGATION BAR
          ========================================== */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100 py-3"
            : "bg-transparent py-5"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href="#" className="flex items-center space-x-2 group">
              <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center shadow-md shadow-emerald-500/25 transition-transform duration-300 group-hover:scale-105">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5.5 h-5.5 text-white"
                >
                  <path d="M11.645 20.91l-.007-.003-.003-.001a11.4 11.4 0 01-1.107-.638A23.778 23.778 0 017.38 17.618C5.23 15.347 3 12.016 3 8.35C3 5.405 5.405 3 8.35 3c1.69 0 3.236.787 4.25 2.015C13.62 3.787 15.165 3 16.85 3c2.945 0 5.35 2.405 5.35 5.35 0 3.665-2.23 6.997-4.38 9.268a23.778 23.778 0 01-3.153 2.652c-.394.274-.753.486-1.107.637l-.003.001-.007.003-.003.001-.005.002a.75.75 0 01-.692 0l-.005-.002z" />
                </svg>
              </div>
              <span className={`text-xl font-bold tracking-tight transition-colors duration-300 ${isScrolled ? "text-slate-900" : "text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]"
                }`}>
                Foosha
              </span>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="#about"
                className={`text-sm font-medium transition-colors hover:text-emerald-500 ${isScrolled ? "text-slate-600" : "text-white/90 hover:text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]"
                  }`}
              >
                About
              </a>
              <a
                href="#how-it-works"
                className={`text-sm font-medium transition-colors hover:text-emerald-500 ${isScrolled ? "text-slate-600" : "text-white/90 hover:text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]"
                  }`}
              >
                How It Works
              </a>
              <a
                href="#impact"
                className={`text-sm font-medium transition-colors hover:text-emerald-500 ${isScrolled ? "text-slate-600" : "text-white/90 hover:text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]"
                  }`}
              >
                Impact
              </a>
              <a
                href="#contact"
                className={`text-sm font-medium transition-colors hover:text-emerald-500 ${isScrolled ? "text-slate-600" : "text-white/90 hover:text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]"
                  }`}
              >
                Contact
              </a>
            </nav>

            {/* CTA Action Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {currentUser ? (
                <div className="flex items-center space-x-3">
                  <span className={`text-sm font-medium ${isScrolled ? "text-slate-700" : "text-white"}`}>
                    Hi, {currentUser.name.split(" ")[0]}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-xs font-semibold text-rose-500 hover:text-rose-600 transition-colors border border-rose-200 hover:border-rose-300 px-2.5 py-1 rounded-md bg-white/10"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setAuthTab("signin");
                    setIsAuthModalOpen(true);
                  }}
                  className={`text-sm font-semibold transition-all hover:text-emerald-500 ${isScrolled ? "text-emerald-600" : "text-white hover:text-emerald-400 drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]"
                    }`}
                >
                  Sign In
                </button>
              )}

              <button
                onClick={() => setIsDonateModalOpen(true)}
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-emerald-500 rounded-full hover:bg-emerald-600 active:scale-95 shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/25 transition-all duration-200 cursor-pointer"
              >
                Donate Food
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg focus:outline-none ${isScrolled ? "text-slate-700 hover:bg-slate-100" : "text-white hover:bg-white/10"
                }`}
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-100 px-4 pt-2 pb-6 space-y-3 shadow-lg">
            <a
              href="#about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-emerald-500"
            >
              About
            </a>
            <a
              href="#how-it-works"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-emerald-500"
            >
              How It Works
            </a>
            <a
              href="#impact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-emerald-500"
            >
              Impact
            </a>
            <a
              href="#contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-emerald-500"
            >
              Contact
            </a>

            <hr className="border-slate-100 my-2" />

            {currentUser ? (
              <div className="px-3 py-2 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">Signed in as {currentUser.name}</span>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-xs font-semibold text-rose-500 border border-rose-200 px-2.5 py-1 rounded"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setAuthTab("signin");
                  setIsAuthModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-emerald-500"
              >
                Sign In
              </button>
            )}

            <button
              onClick={() => {
                setIsDonateModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="w-full inline-flex items-center justify-center px-4 py-2.5 text-base font-semibold text-white bg-emerald-500 rounded-full hover:bg-emerald-600 shadow-md shadow-emerald-500/15"
            >
              Donate Food
            </button>
          </div>
        )}
      </header>

      {/* ==========================================
          2. HERO SECTION
          ========================================== */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-slate-900 overflow-hidden">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-bg.png"
            alt="Children with food"
            fill
            className="object-cover opacity-60 scale-105 transition-transform duration-10000 ease-out"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-slate-950/75 z-10" />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white pt-20">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 drop-shadow-md">
            Together We Can End
            <span className="block mt-2 text-emerald-400 bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              Food Waste
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-200 font-light max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
            Connect surplus food with those who need it most. Join our community of donors, volunteers, and partners
            making a difference.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setIsHelpModalOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-emerald-500 rounded-full hover:bg-emerald-600 active:scale-95 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/35 transition-all duration-200 cursor-pointer"
            >
              NEED HELP?
            </button>

            <a
              href="#about"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/45 rounded-full backdrop-blur-sm transition-all duration-200"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center animate-bounce">
          <span className="text-xs text-white/50 mb-1 tracking-widest font-mono">SCROLL DOWN</span>
          <svg className="w-5 h-5 text-white/55" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* ==========================================
          3. ABOUT US SECTION
          ========================================== */}
      <section id="about" className="py-24 bg-white scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-3">About Foosha</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Bridging the Gap Between Surplus Food and Hunger
            </p>
            <div className="w-16 h-1 bg-emerald-500 mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Our Mission</h3>
              <p className="text-slate-600 leading-relaxed mb-6">
                Globally, over one-third of all food produced is wasted while millions go hungry. Foosha was founded as
                an alliance to coordinate, match, and distribute edible surplus food before it spoils.
              </p>
              <p className="text-slate-600 leading-relaxed mb-6">
                By providing a high-fidelity logistics pipeline matching local donor establishments with volunteers and
                community kitchens, we turn waste into nutritional support, minimizing landfill gases and feeding hope.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 border-t border-slate-100 pt-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 font-bold">✓</div>
                  <span className="text-sm font-semibold text-slate-700">100% Safe Handling</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 font-bold">✓</div>
                  <span className="text-sm font-semibold text-slate-700">Vetted Charity Network</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-md hover:border-emerald-100 transition-all">
                <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white mb-6">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">Food Donors</h4>
                <p className="text-sm text-slate-600">
                  Supermarkets, restaurants, and caterers upload surplus batches with simple steps.
                </p>
              </div>

              <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-md hover:border-emerald-100 transition-all">
                <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white mb-6">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">Volunteer Riders</h4>
                <p className="text-sm text-slate-600">
                  Local couriers get route notifications to pick up and securely transport donations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          4. HOW IT WORKS SECTION
          ========================================== */}
      <section id="how-it-works" className="py-24 bg-slate-50 border-y border-slate-100 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-3">Workflow</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              A Seamless Three-Way Logistics Alliance
            </p>
            <div className="w-16 h-1 bg-emerald-500 mx-auto mt-4 rounded-full" />
          </div>

          {/* Navigation Tabs */}
          <div className="flex justify-center space-x-2 md:space-x-4 mb-12 bg-slate-200/50 p-1.5 rounded-full max-w-md mx-auto">
            <button
              onClick={() => setActiveTab("donors")}
              className={`flex-1 py-3 px-4 rounded-full text-sm font-semibold transition-all ${activeTab === "donors" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
            >
              For Donors
            </button>
            <button
              onClick={() => setActiveTab("volunteers")}
              className={`flex-1 py-3 px-4 rounded-full text-sm font-semibold transition-all ${activeTab === "volunteers" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
            >
              For Volunteers
            </button>
            <button
              onClick={() => setActiveTab("recipients")}
              className={`flex-1 py-3 px-4 rounded-full text-sm font-semibold transition-all ${activeTab === "recipients" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
            >
              For Recipients
            </button>
          </div>

          {/* Interactive Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {activeTab === "donors" && (
              <>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full flex items-start justify-end p-4 text-slate-200 text-3xl font-extrabold select-none">
                    01
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4 mt-2">Log Food details</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Click &quot;Donate Food&quot; and list details about ingredients, portion sizing, expiry time, and food preservation type.
                  </p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full flex items-start justify-end p-4 text-slate-200 text-3xl font-extrabold select-none">
                    02
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4 mt-2">Schedule Pickup</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Define location address and select coordinates along with preferred time slots when food is ready.
                  </p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full flex items-start justify-end p-4 text-slate-200 text-3xl font-extrabold select-none">
                    03
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4 mt-2">Pass to Courier</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Vetted riders arrive with thermal bags to take over packaging and distribute it directly to locations.
                  </p>
                </div>
              </>
            )}

            {activeTab === "volunteers" && (
              <>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full flex items-start justify-end p-4 text-slate-200 text-3xl font-extrabold select-none">
                    01
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4 mt-2">Get Pickup Alert</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Get real-time notification on map based matching with nearby establishments offering surplus batches.
                  </p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full flex items-start justify-end p-4 text-slate-200 text-3xl font-extrabold select-none">
                    02
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4 mt-2">Check & Collect</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Verify compliance guidelines (seal, expiry, temperature indicators) and pack into thermal cargo carriers.
                  </p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full flex items-start justify-end p-4 text-slate-200 text-3xl font-extrabold select-none">
                    03
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4 mt-2">Direct Handover</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Navigate route directions towards beneficiary kitchens or designated distributions points.
                  </p>
                </div>
              </>
            )}

            {activeTab === "recipients" && (
              <>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full flex items-start justify-end p-4 text-slate-200 text-3xl font-extrabold select-none">
                    01
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4 mt-2">Post Demands</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Relief workers or centers click &quot;NEED HELP&quot; and post dietary specifications and headcount targets.
                  </p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full flex items-start justify-end p-4 text-slate-200 text-3xl font-extrabold select-none">
                    02
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4 mt-2">Auto-Matching</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Our backend algorithms optimize match logs sorting foods relative to request queues and distance.
                  </p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full flex items-start justify-end p-4 text-slate-200 text-3xl font-extrabold select-none">
                    03
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4 mt-2">Prepare & Serve</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Accept delivery, verify quantities, heat safely, and prepare warm nutritious plates for local families.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ==========================================
          5. IMPACT SECTION (WITH SAVINGS CALCULATOR)
          ========================================== */}
      <section id="impact" className="py-24 bg-white scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-3">Our Footprint</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Transforming Waste into Solid Impact Numbers
            </p>
            <div className="w-16 h-1 bg-emerald-500 mx-auto mt-4 rounded-full" />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            <div className="bg-slate-50/50 border border-slate-100 p-6 rounded-2xl text-center">
              <span className="block text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2">12,480+</span>
              <span className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wider">Meals Delivered</span>
            </div>
            <div className="bg-slate-50/50 border border-slate-100 p-6 rounded-2xl text-center">
              <span className="block text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2">9.6 Tons</span>
              <span className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wider">Food Rescued</span>
            </div>
            <div className="bg-slate-50/50 border border-slate-100 p-6 rounded-2xl text-center">
              <span className="block text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2">24.5 Tons</span>
              <span className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wider">CO2 Saved</span>
            </div>
            <div className="bg-slate-50/50 border border-slate-100 p-6 rounded-2xl text-center">
              <span className="block text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2">150+</span>
              <span className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wider">Active Partners</span>
            </div>
          </div>

          {/* Interactive Calculator (Wow-Factor Widget) */}
          <div className="bg-emerald-950 text-white rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-800/10 rounded-full blur-3xl" />
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
              <div className="lg:col-span-3">
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-4">
                  Estimate Your Food Waste Reduction Impact
                </h3>
                <p className="text-emerald-200 text-sm sm:text-base leading-relaxed mb-6">
                  Input an estimated amount of food (in kilograms) you throw away or could salvage, and see how much positive environmental and social impact your alliance would create.
                </p>

                <div className="flex items-center space-x-3 bg-emerald-900/40 border border-emerald-850 p-2.5 rounded-xl max-w-sm">
                  <span className="text-sm font-semibold text-emerald-300 pl-2">Salvage Weight:</span>
                  <input
                    type="number"
                    value={calcQuantity}
                    onChange={(e) => setCalcQuantity(e.target.value)}
                    min="1"
                    className="flex-1 bg-emerald-900 border border-emerald-800 text-white font-bold rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                  />
                  <span className="text-sm font-bold pr-2">kg</span>
                </div>
              </div>

              <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                <div className="bg-emerald-900/35 border border-emerald-800/40 p-6 rounded-2xl text-center">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-5.5 h-5.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="block text-2xl sm:text-3xl font-extrabold">{mealsSaved}</span>
                  <span className="text-xs text-emerald-300 font-medium">Nutritious Meals Served</span>
                </div>

                <div className="bg-emerald-900/35 border border-emerald-800/40 p-6 rounded-2xl text-center">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-5.5 h-5.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h2a2.5 2.5 0 002.5-2.5V8.5a.5.5 0 011 0V5a2 2 0 00-2-2h-3.935m-2.13 14.13A10 10 0 1118.07 4.07" />
                    </svg>
                  </div>
                  <span className="block text-2xl sm:text-3xl font-extrabold">{co2Prevented} kg</span>
                  <span className="text-xs text-emerald-300 font-medium">CO2 Emission Avoided</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          6. CONTACT SECTION
          ========================================== */}
      <section id="contact" className="py-24 bg-slate-50 border-t border-slate-100 scroll-mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-3">Reach Us</h2>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Get in Touch with Our Coordinators
            </p>
            <div className="w-16 h-1 bg-emerald-500 mx-auto mt-3 rounded-full" />
          </div>

          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100">
            {contactSubmitted ? (
              <div className="bg-emerald-55/70 border border-emerald-200 text-emerald-900 rounded-xl p-6 text-center animate-fade-in">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold">Thank you!</h4>
                <p className="text-sm mt-1">Your message was transmitted successfully. We will reply to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="contact-name" className="block text-sm font-semibold text-slate-700 mb-1">
                      Full Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="e.g. Juan Dela Cruz"
                      className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-sm font-semibold text-slate-700 mb-1">
                      Email Address
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="juandelacruz@example.com"
                      className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm focus:outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-sm font-semibold text-slate-700 mb-1">
                    Your Message
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="How would you like to collaborate with Foosha alliance?"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm focus:outline-none transition resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isContactLoading}
                  className="w-full inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold text-white bg-emerald-500 rounded-xl hover:bg-emerald-600 active:scale-98 disabled:opacity-70 transition cursor-pointer"
                >
                  {isContactLoading ? (
                    <span className="flex items-center space-x-2">
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Transmitting...</span>
                    </span>
                  ) : (
                    <span>Send Message</span>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ==========================================
          7. FOOTER
          ========================================== */}
      <footer className="bg-slate-900 text-white py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <a href="#" className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-extrabold text-sm">
                  F
                </div>
                <span className="text-lg font-bold tracking-tight">Foosha</span>
              </a>
              <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
                Empowering businesses, riders, and community kitchens to form a food rescue alliance saving the planet one meal at a time.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-300 mb-4">Explore</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#about" className="hover:text-emerald-400 transition">About Us</a></li>
                <li><a href="#how-it-works" className="hover:text-emerald-400 transition">How It Works</a></li>
                <li><a href="#impact" className="hover:text-emerald-400 transition">Impact Statistics</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-300 mb-4">Get Involved</h4>
              <button onClick={() => setIsDonateModalOpen(true)} className="block text-sm text-slate-400 hover:text-emerald-400 transition text-left cursor-pointer">
                Donate Food
              </button>
              <button onClick={() => { setAuthTab("signup"); setIsAuthModalOpen(true); }} className="block text-sm text-slate-400 hover:text-emerald-400 transition text-left mt-2 cursor-pointer">
                Become a Volunteer
              </button>
              <a href="#contact" className="block text-sm text-slate-400 hover:text-emerald-400 transition mt-2">
                Partner Establishments
              </a>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 space-y-4 sm:space-y-0">
            <span>&copy; {new Date().getFullYear()} Foosha Food Waste Alliance. All rights reserved.</span>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-emerald-400 transition">Privacy Policy</a>
              <a href="#" className="hover:text-emerald-400 transition">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {/* ==========================================
          8. AUTHENTICATION MODAL (SIGN IN / SIGN UP)
          ========================================== */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fade-in">
          {/* Backdrop */}
          <div onClick={() => setIsAuthModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />

          {/* Modal Box */}
          <div className="relative bg-white w-full max-w-md rounded-3xl p-8 shadow-xl border border-slate-100 z-10 animate-scale-up">
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition"
            >
              <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Tabs */}
            <div className="flex border-b border-slate-100 mb-6">
              <button
                onClick={() => setAuthTab("signin")}
                className={`flex-1 pb-3 text-sm font-bold tracking-tight border-b-2 transition-all ${authTab === "signin" ? "border-emerald-500 text-emerald-600" : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setAuthTab("signup")}
                className={`flex-1 pb-3 text-sm font-bold tracking-tight border-b-2 transition-all ${authTab === "signup" ? "border-emerald-500 text-emerald-600" : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
              >
                Sign Up
              </button>
            </div>

            {/* Auth Form */}
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authTab === "signup" && (
                <div>
                  <label htmlFor="auth-name" className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    Your Name
                  </label>
                  <input
                    id="auth-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g.  Juan Dela Cruz"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm focus:outline-none transition"
                  />
                </div>
              )}

              <div>
                <label htmlFor="auth-email" className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Email Address
                </label>
                <input
                  id="auth-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="juandelacruz@example.com"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm focus:outline-none transition"
                />
              </div>

              <div>
                <label htmlFor="auth-pass" className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="auth-pass"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl pl-4 pr-11 py-3 text-sm focus:outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {authTab === "signup" && (
                <div className="flex items-center space-x-2 pt-1">
                  <input
                    type="checkbox"
                    id="volunteer-checkbox"
                    className="w-4 h-4 text-emerald-500 rounded focus:ring-emerald-400 border-slate-300"
                  />
                  <label htmlFor="volunteer-checkbox" className="text-xs font-semibold text-slate-600 select-none">
                    Register as a Volunteer Partner (Rider/Relief Worker)
                  </label>
                </div>
              )}

              <button
                type="submit"
                disabled={isAuthLoading}
                className="w-full inline-flex items-center justify-center px-6 py-3.5 mt-4 text-sm font-semibold text-white bg-emerald-500 rounded-xl hover:bg-emerald-600 active:scale-98 disabled:opacity-70 transition cursor-pointer"
              >
                {isAuthLoading ? (
                  <span className="flex items-center space-x-2">
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Processing authentication...</span>
                  </span>
                ) : (
                  <span>{authTab === "signin" ? "Sign In" : "Create Account"}</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          9. DONATE FOOD MODAL (MULTI-STEP)
          ========================================== */}
      {isDonateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fade-in">
          {/* Backdrop */}
          <div onClick={() => { resetDonationModal(); setIsDonateModalOpen(false); }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />

          {/* Modal Box */}
          <div className="relative bg-white w-full max-w-lg rounded-3xl p-8 shadow-xl border border-slate-100 z-10 animate-scale-up">
            <button
              onClick={() => { resetDonationModal(); setIsDonateModalOpen(false); }}
              className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition"
            >
              <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-xl font-bold tracking-tight text-slate-900 mb-2">Donate Surplus Food</h3>
            <p className="text-xs text-slate-500 mb-6">Complete information to match with nearest delivery partners.</p>

            {donationSuccess ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-slate-900">Donation Successfully Logged!</h4>
                <p className="text-sm text-slate-500 max-w-sm mx-auto mt-2 leading-relaxed">
                  We&apos;ve successfully updated local state. A driver will be assigned shortly. Keep food sealed and stored at proper temperatures.
                </p>
                <button
                  onClick={() => { resetDonationModal(); setIsDonateModalOpen(false); }}
                  className="mt-6 inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-white bg-emerald-500 rounded-full hover:bg-emerald-600 transition"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleDonateSubmit}>
                {/* Progress Indicators */}
                <div className="flex items-center justify-between mb-8 px-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${donateStep >= 1 ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400"
                      }`}>
                      1
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 mt-1">Food Info</span>
                  </div>
                  <div className="flex-1 h-0.5 bg-slate-100 mx-2 -translate-y-2">
                    <div className={`h-full bg-emerald-500 transition-all duration-300 ${donateStep >= 2 ? "w-full" : "w-0"}`} />
                  </div>
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${donateStep >= 2 ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400"
                      }`}>
                      2
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 mt-1">Logistics</span>
                  </div>
                  <div className="flex-1 h-0.5 bg-slate-100 mx-2 -translate-y-2">
                    <div className={`h-full bg-emerald-500 transition-all duration-300 ${donateStep >= 3 ? "w-full" : "w-0"}`} />
                  </div>
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${donateStep >= 3 ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400"
                      }`}>
                      3
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 mt-1">Confirm</span>
                  </div>
                </div>

                {/* Step 1 Content */}
                {donateStep === 1 && (
                  <div className="space-y-4 animate-fade-in">
                    <div>
                      <label htmlFor="donate-item" className="block text-xs font-bold uppercase text-slate-500 mb-1">
                        Food Item Name
                      </label>
                      <input
                        id="donate-item"
                        type="text"
                        required
                        value={donationForm.foodName}
                        onChange={(e) => setDonationForm({ ...donationForm, foodName: e.target.value })}
                        placeholder="e.g. 15 Trays of Steamed Rice & Veggies"
                        className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm focus:outline-none transition"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="donate-category" className="block text-xs font-bold uppercase text-slate-500 mb-1">
                          Category
                        </label>
                        <select
                          id="donate-category"
                          value={donationForm.category}
                          onChange={(e) => setDonationForm({ ...donationForm, category: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm focus:outline-none transition"
                        >
                          <option value="cooked">Cooked Hot Food</option>
                          <option value="fresh">Fresh Fruits & Produce</option>
                          <option value="pantry">Canned / Dry Pantry</option>
                          <option value="bakery">Bakery Items</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="donate-qty" className="block text-xs font-bold uppercase text-slate-500 mb-1">
                          Quantity (Est. kg/lbs)
                        </label>
                        <input
                          id="donate-qty"
                          type="text"
                          required
                          value={donationForm.quantity}
                          onChange={(e) => setDonationForm({ ...donationForm, quantity: e.target.value })}
                          placeholder="e.g. 12 kg or 25 portions"
                          className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm focus:outline-none transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="donate-expiry" className="block text-xs font-bold uppercase text-slate-500 mb-1">
                        Best Before Date & Time
                      </label>
                      <input
                        id="donate-expiry"
                        type="datetime-local"
                        required
                        value={donationForm.expiryDate}
                        onChange={(e) => setDonationForm({ ...donationForm, expiryDate: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm focus:outline-none transition"
                      />
                    </div>

                    <div className="flex justify-end pt-4">
                      <button
                        type="button"
                        onClick={() => donationForm.foodName && donationForm.quantity && donationForm.expiryDate ? setDonateStep(2) : alert("Please fill required fields")}
                        className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-emerald-500 rounded-xl hover:bg-emerald-600 transition"
                      >
                        Next Step
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2 Content */}
                {donateStep === 2 && (
                  <div className="space-y-4 animate-fade-in">
                    <div>
                      <label htmlFor="donate-address" className="block text-xs font-bold uppercase text-slate-500 mb-1">
                        Pickup Location Address
                      </label>
                      <textarea
                        id="donate-address"
                        required
                        rows={2}
                        value={donationForm.pickupAddress}
                        onChange={(e) => setDonationForm({ ...donationForm, pickupAddress: e.target.value })}
                        placeholder="Establishment / Street Name, Floor, Suite"
                        className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm focus:outline-none transition resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="donate-contact" className="block text-xs font-bold uppercase text-slate-500 mb-1">
                          Contact Phone
                        </label>
                        <input
                          id="donate-contact"
                          type="tel"
                          required
                          value={donationForm.contactNumber}
                          onChange={(e) => setDonationForm({ ...donationForm, contactNumber: e.target.value })}
                          placeholder="e.g. +63 912 345 6789"
                          className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm focus:outline-none transition"
                        />
                      </div>

                      <div>
                        <label htmlFor="donate-time" className="block text-xs font-bold uppercase text-slate-500 mb-1">
                          Pickup Time Slot
                        </label>
                        <input
                          id="donate-time"
                          type="text"
                          required
                          value={donationForm.pickupTime}
                          onChange={(e) => setDonationForm({ ...donationForm, pickupTime: e.target.value })}
                          placeholder="e.g. Today, 5:00 PM - 7:00 PM"
                          className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm focus:outline-none transition"
                        />
                      </div>
                    </div>

                    <div className="flex justify-between pt-4">
                      <button
                        type="button"
                        onClick={() => setDonateStep(1)}
                        className="inline-flex items-center justify-center px-5 py-3 text-sm font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={() => donationForm.pickupAddress && donationForm.contactNumber && donationForm.pickupTime ? setDonateStep(3) : alert("Please fill required fields")}
                        className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-emerald-500 rounded-xl hover:bg-emerald-600 transition"
                      >
                        Review
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3 Content */}
                {donateStep === 3 && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-sm space-y-3">
                      <div className="flex justify-between border-b border-slate-100 pb-2">
                        <span className="font-semibold text-slate-500">Food Item:</span>
                        <span className="font-bold text-slate-900">{donationForm.foodName}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-2">
                        <span className="font-semibold text-slate-500">Category / Qty:</span>
                        <span className="font-bold text-slate-900 capitalize">{donationForm.category} ({donationForm.quantity})</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-2">
                        <span className="font-semibold text-slate-500">Best Before:</span>
                        <span className="font-bold text-slate-900">{new Date(donationForm.expiryDate).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-2">
                        <span className="font-semibold text-slate-500">Pickup Location:</span>
                        <span className="font-bold text-slate-900 text-right max-w-xs truncate">{donationForm.pickupAddress}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold text-slate-500">Contact / Slot:</span>
                        <span className="font-bold text-slate-900">{donationForm.contactNumber} ({donationForm.pickupTime})</span>
                      </div>
                    </div>

                    <div className="flex justify-between pt-4">
                      <button
                        type="button"
                        onClick={() => setDonateStep(2)}
                        className="inline-flex items-center justify-center px-5 py-3 text-sm font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={isDonateLoading}
                        className="inline-flex items-center justify-center px-8 py-3 text-sm font-semibold text-white bg-emerald-500 rounded-xl hover:bg-emerald-600 active:scale-98 disabled:opacity-75 transition cursor-pointer"
                      >
                        {isDonateLoading ? (
                          <span className="flex items-center space-x-2">
                            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            <span>Submitting...</span>
                          </span>
                        ) : (
                          <span>Submit Donation</span>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      )}

      {/* ==========================================
          10. NEED HELP / REQUEST SUPPORT MODAL
          ========================================== */}
      {isHelpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fade-in">
          {/* Backdrop */}
          <div onClick={() => { resetHelpModal(); setIsHelpModalOpen(false); }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />

          {/* Modal Box */}
          <div className="relative bg-white w-full max-w-md rounded-3xl p-8 shadow-xl border border-slate-100 z-10 animate-scale-up">
            <button
              onClick={() => { resetHelpModal(); setIsHelpModalOpen(false); }}
              className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition"
            >
              <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-xl font-bold tracking-tight text-slate-900 mb-2">Request Food Relief</h3>
            <p className="text-xs text-slate-500 mb-6">Are you a community kitchen, shelter, or family in need? Post a food request.</p>

            {helpSuccess ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-slate-900">Request Registered!</h4>
                <p className="text-sm text-slate-500 max-w-sm mx-auto mt-2 leading-relaxed">
                  Your request was saved into prototype state. Our logistics alliance algorithm matches you with nearest surplus donors.
                </p>
                <button
                  onClick={() => { resetHelpModal(); setIsHelpModalOpen(false); }}
                  className="mt-6 inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-white bg-emerald-500 rounded-full hover:bg-emerald-600 transition"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleHelpSubmit} className="space-y-4">
                <div>
                  <label htmlFor="help-name" className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    Requester / Org Name
                  </label>
                  <input
                    id="help-name"
                    type="text"
                    required
                    value={helpForm.recipientName}
                    onChange={(e) => setHelpForm({ ...helpForm, recipientName: e.target.value })}
                    placeholder="e.g. Grace Shelter Home"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm focus:outline-none transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="help-count" className="block text-xs font-bold uppercase text-slate-500 mb-1">
                      Headcount Target (Est.)
                    </label>
                    <input
                      id="help-count"
                      type="number"
                      required
                      value={helpForm.peopleCount}
                      onChange={(e) => setHelpForm({ ...helpForm, peopleCount: e.target.value })}
                      placeholder="e.g. 60 people"
                      className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm focus:outline-none transition"
                    />
                  </div>

                  <div className="flex flex-col justify-center pl-2 pt-4">
                    <label className="inline-flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={helpForm.isUrgent}
                        onChange={(e) => setHelpForm({ ...helpForm, isUrgent: e.target.checked })}
                        className="w-4 h-4 text-rose-500 rounded focus:ring-rose-400 border-slate-300"
                      />
                      <span className="text-xs font-bold text-rose-600 select-none">URGENT HELP?</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label htmlFor="help-desc" className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    Describe Dietary Needs
                  </label>
                  <textarea
                    id="help-desc"
                    required
                    rows={3}
                    value={helpForm.needsDescription}
                    onChange={(e) => setHelpForm({ ...helpForm, needsDescription: e.target.value })}
                    placeholder="e.g. Healthy lunch boxes, cooked vegetables, baby food supplies, pantry items."
                    className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm focus:outline-none transition resize-none"
                  />
                </div>

                <div>
                  <label htmlFor="help-address" className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    Delivery Address
                  </label>
                  <input
                    id="help-address"
                    type="text"
                    required
                    value={helpForm.deliveryAddress}
                    onChange={(e) => setHelpForm({ ...helpForm, deliveryAddress: e.target.value })}
                    placeholder="Drop-off location details"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm focus:outline-none transition"
                  />
                </div>

                <div>
                  <label htmlFor="help-contact" className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    Contact Phone Number
                  </label>
                  <input
                    id="help-contact"
                    type="tel"
                    required
                    value={helpForm.contactNumber}
                    onChange={(e) => setHelpForm({ ...helpForm, contactNumber: e.target.value })}
                    placeholder="e.g. +63 912 345 6789"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm focus:outline-none transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isHelpLoading}
                  className="w-full inline-flex items-center justify-center px-6 py-3.5 mt-2 text-sm font-semibold text-white bg-emerald-500 rounded-xl hover:bg-emerald-600 active:scale-98 disabled:opacity-70 transition cursor-pointer"
                >
                  {isHelpLoading ? (
                    <span className="flex items-center space-x-2">
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Transmitting Request...</span>
                    </span>
                  ) : (
                    <span>Post Request Help</span>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ==========================================
          11. FAQ CHATBOT DRAWER / WIDGET
          ========================================== */}
      <div className="fixed bottom-6 right-6 z-40">
        {/* Chat Toggle Button */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-14 h-14 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-emerald-500 active:scale-95 transition-all duration-300 cursor-pointer group"
          aria-label="Toggle support chat"
        >
          {isChatOpen ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <span className="text-xl font-bold font-mono group-hover:scale-110 transition-transform">?</span>
          )}
        </button>

        {/* Chat Drawer Box */}
        {isChatOpen && (
          <div className="absolute bottom-16 right-0 w-80 sm:w-96 h-[480px] bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden z-50 animate-scale-up">
            {/* Chat Header */}
            <div className="bg-slate-900 p-4 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
                <span className="font-bold text-sm">Foosha Help Bot</span>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="text-slate-400 hover:text-white transition"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Chat Messages Log */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${msg.sender === "user"
                        ? "bg-emerald-500 text-white rounded-tr-none shadow-sm"
                        : "bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-xs"
                      }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isBotTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 text-slate-400 rounded-2xl rounded-tl-none px-4 py-3 text-xs flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions (FAQ Prompts) */}
            <div className="p-3 border-t border-slate-100 bg-white grid grid-cols-2 gap-2">
              {faqQuestions.map((q) => (
                <button
                  key={q.key}
                  onClick={() => handleChatQuestionClick(q.q, q.key)}
                  className="p-2 border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30 text-[10px] sm:text-xs font-semibold text-slate-600 hover:text-emerald-700 text-left rounded-lg transition"
                >
                  {q.q}
                </button>
              ))}
            </div>

            {/* Custom Input Form */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 bg-slate-50 flex items-center space-x-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask something..."
                className="flex-1 bg-white border border-slate-200 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-xs sm:text-sm focus:outline-none transition"
              />
              <button
                type="submit"
                className="p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-md transition active:scale-95 cursor-pointer"
              >
                <svg className="w-4 h-4 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
