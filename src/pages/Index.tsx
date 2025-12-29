import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  Dumbbell, 
  Users, 
  CreditCard, 
  BarChart3, 
  ArrowRight,
  CheckCircle2,
  Shield,
  Sun,
  Moon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: Users,
    title: 'Member Management',
    description: 'Easily add, edit, and track all your gym members in one place.',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80'
  },
  {
    icon: CreditCard,
    title: 'Fee Tracking',
    description: 'Monitor payments, track pending fees, and identify defaulters instantly.',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80'
  },
  {
    icon: BarChart3,
    title: 'Expense Analytics',
    description: 'Track and categorize expenses with monthly filters and insights.',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80'
  },
  {
    icon: Shield,
    title: 'Secure & Reliable',
    description: 'Your data is protected with enterprise-grade security.',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80'
  },
];

const Index = () => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 ${isDark ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-sm shadow-sm transition-colors duration-300`}>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold">
              <span className={isDark ? 'text-white' : 'text-gray-900'}>Gym</span>
              <span className="text-orange-500">Manager</span>
            </span>
          </Link>
          
          <div className="flex items-center gap-6">
            <a href="#home" className={`hidden md:block ${isDark ? 'text-white hover:text-orange-500' : 'text-gray-900 hover:text-orange-500'} transition-colors`}>Home</a>
            <a href="#program" className={`hidden md:block ${isDark ? 'text-white hover:text-orange-500' : 'text-gray-900 hover:text-orange-500'} transition-colors`}>Program</a>
            <a href="#pricing" className={`hidden md:block ${isDark ? 'text-white hover:text-orange-500' : 'text-gray-900 hover:text-orange-500'} transition-colors`}>Pricing</a>
            <a href="#contact" className={`hidden md:block ${isDark ? 'text-white hover:text-orange-500' : 'text-gray-900 hover:text-orange-500'} transition-colors`}>Contact</a>
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg ${isDark ? 'bg-gray-800 text-yellow-400' : 'bg-gray-200 text-gray-700'} hover:bg-orange-500 hover:text-white transition-all`}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            
            <Link to="/auth">
              <Button className="bg-transparent border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition-colors">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className={`relative overflow-hidden pt-24 pb-20 lg:pt-32 lg:pb-32 ${isDark ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900/20' : 'bg-gradient-to-br from-gray-100 via-white to-orange-50'} transition-colors duration-300`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className={`text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'} leading-tight`}>
                SHAPE YOUR
                <br />
                <span className="text-orange-500">BODY</span>
              </h1>
              
              <p className={`mt-6 text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'} max-w-lg`}>
                Transform your fitness journey with our comprehensive gym management system. Track progress, manage memberships, and achieve your goals.
              </p>
              
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/auth?mode=register">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 text-lg">
                    Get Started
                  </Button>
                </Link>
                {/* <Button variant="outline" className={`${isDark ? 'border-white text-white hover:bg-white hover:text-gray-900' : 'border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white'} px-8 py-6 text-lg`}>
                  Learn More
                </Button> */}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="absolute top-10 right-10 bg-orange-500 rounded-2xl p-6 text-center z-10 shadow-2xl">
                <div className="text-white">
                  <p className="text-2xl font-bold">Available</p>
                  <p className="text-4xl font-bold">24/7</p>
                </div>
              </div>
              <div className="relative h-[500px] rounded-2xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80" 
                  alt="Fitness training"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Program Section */}
      <section id="program" className={`py-20 lg:py-32 ${isDark ? 'bg-gray-800' : 'bg-white'} transition-colors duration-300`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-4xl sm:text-5xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              PROGRAM
            </h2>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`group relative rounded-xl ${isDark ? 'bg-gray-900' : 'bg-gray-50'} overflow-hidden transition-all hover:shadow-xl`}
              >
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className={`mb-3 text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {feature.title}
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                    {feature.description}
                  </p>
                  <Link to="/auth?mode=register" className="flex items-center gap-2 text-orange-500 hover:gap-3 transition-all text-sm font-semibold">
                    Join Now
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} max-w-3xl mx-auto`}>
              Our comprehensive program management system helps you track every aspect of your gym operations with ease and efficiency.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Ready to Level Up Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-r from-orange-600 to-orange-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                READY TO
                <br />
                LEVEL UP
                <br />
                YOUR BODY
              </h2>
              <Link to="/auth?mode=register" className="mt-8 inline-block">
                <Button className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-6 text-lg font-semibold">
                  Get Started
                </Button>
              </Link>
              <p className="mt-6 text-white/90 max-w-lg">
                Join thousands of fitness enthusiasts who have transformed their bodies and achieved their fitness goals with our proven training programs and expert guidance.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80" 
                  alt="Gym workout"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Program Section Dark */}
      <section className={`py-20 lg:py-32 ${isDark ? 'bg-gray-800' : 'bg-gray-100'} transition-colors duration-300`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-2xl overflow-hidden shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80" 
                  alt="Personal training"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className={`text-4xl sm:text-5xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>
                PROGRAM
              </h2>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-8 max-w-lg`}>
                Our cutting-edge gym management software streamlines operations, enhances member experience, and helps you focus on what matters most - helping people achieve their fitness goals.
              </p>
              <Link to="/auth?mode=register">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 text-lg">
                  Get Started
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Personal Trainer Section */}
      <section className={`py-20 lg:py-32 ${isDark ? 'bg-gray-900' : 'bg-white'} transition-colors duration-300`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-4xl sm:text-5xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
              PERSONAL TRAINER
            </h2>
          </motion.div>

          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-2xl overflow-hidden shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=80" 
                  alt="Personal trainer"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className={`${isDark ? '' : ''} rounded-2xl p-8`}
            >
              <h3 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>ABOUT US</h3>
              <Link to="/auth?mode=register" className="inline-block mb-6">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3">
                  Get Started
                </Button>
              </Link>
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                We are dedicated to providing the best gym management solutions in the industry. Our platform combines cutting-edge technology with user-friendly design to help gym owners streamline operations and grow their business.
              </p>
              <div className="mt-8 bg-orange-500 rounded-xl p-6">
                <h4 className="text-xl font-bold text-white mb-2">Strength Training</h4>
                <p className="text-white/90 text-sm">
                  Build muscle, increase strength, and transform your physique with our comprehensive strength training programs designed by certified professionals.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className={`py-20 lg:py-32 ${isDark ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-4xl sm:text-5xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
              SIMPLE TRANSPARENT PRICING
            </h2>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {/* Free Trial */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl p-8 border-2`}
            >
              <h3 className={`text-sm font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>Trial</h3>
              <div className="mb-6">
                <span className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>$0</span>
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}> / Month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className={`flex items-center gap-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <CheckCircle2 className="h-5 w-5 text-orange-500 flex-shrink-0" />
                  1 Month Free Trial
                </li>
                <li className={`flex items-center gap-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <CheckCircle2 className="h-5 w-5 text-orange-500 flex-shrink-0" />
                  All Core Features
                </li>
                <li className={`flex items-center gap-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <CheckCircle2 className="h-5 w-5 text-orange-500 flex-shrink-0" />
                  Member Management
                </li>
                <li className={`flex items-center gap-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <CheckCircle2 className="h-5 w-5 text-orange-500 flex-shrink-0" />
                  Fee Tracking
                </li>
                <li className={`flex items-center gap-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <CheckCircle2 className="h-5 w-5 text-orange-500 flex-shrink-0" />
                  Basic Reports
                </li>
              </ul>
              <Link to="/auth?mode=register" className="block">
                <Button className={`w-full ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'}`}>
                  Start Free Trial
                </Button>
              </Link>
            </motion.div>

            {/* Monthly - Featured */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-orange-600 to-orange-500 rounded-2xl p-8 border-2 border-orange-400 relative transform scale-105"
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-white text-orange-600 px-4 py-1 rounded-full text-sm font-bold">
                POPULAR
              </div>
              <h3 className="text-sm font-semibold text-white/90 mb-2">Monthly</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">$20</span>
                <span className="text-white/90"> / Month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-white">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                  All Trial Features
                </li>
                <li className="flex items-center gap-3 text-white">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                  Advanced Analytics
                </li>
                <li className="flex items-center gap-3 text-white">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                  Expense Tracking
                </li>
                <li className="flex items-center gap-3 text-white">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                  Priority Support
                </li>
                <li className="flex items-center gap-3 text-white">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                  Export Reports
                </li>
                <li className="flex items-center gap-3 text-white">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                  Multi-branch Support
                </li>
              </ul>
              <Link to="/auth?mode=register" className="block">
                <Button className="w-full bg-white text-orange-600 hover:bg-gray-100">
                  Get Started
                </Button>
              </Link>
            </motion.div>

            {/* Custom Software */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl p-8 border-2`}
            >
              <h3 className={`text-sm font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>Custom</h3>
              <div className="mb-6">
                <span className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Custom</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className={`flex items-center gap-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <CheckCircle2 className="h-5 w-5 text-orange-500 flex-shrink-0" />
                  Tailored Solutions
                </li>
                <li className={`flex items-center gap-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <CheckCircle2 className="h-5 w-5 text-orange-500 flex-shrink-0" />
                  Custom Features
                </li>
                <li className={`flex items-center gap-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <CheckCircle2 className="h-5 w-5 text-orange-500 flex-shrink-0" />
                  Dedicated Support
                </li>
                <li className={`flex items-center gap-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <CheckCircle2 className="h-5 w-5 text-orange-500 flex-shrink-0" />
                  Integration Services
                </li>
                <li className={`flex items-center gap-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <CheckCircle2 className="h-5 w-5 text-orange-500 flex-shrink-0" />
                  On-site Training
                </li>
              </ul>
              <a href="#contact">
                <Button className={`w-full ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'}`}>
                  Contact Us
                </Button>
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className={`py-20 lg:py-32 ${isDark ? 'bg-gray-800' : 'bg-white'} transition-colors duration-300`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="aspect-square rounded-2xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80" 
                  alt="Workout 1"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square rounded-2xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80" 
                  alt="Workout 2"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square rounded-2xl overflow-hidden col-span-2">
                <img 
                  src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80" 
                  alt="Workout 3"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-orange-600 to-orange-500 rounded-2xl p-8 lg:p-12"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8">
                WHY CHOOSE US?
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-white">
                  <CheckCircle2 className="h-6 w-6 flex-shrink-0 mt-1" />
                  <span>HAVE A PERSONAL TRAINER</span>
                </li>
                <li className="flex items-start gap-3 text-white">
                  <CheckCircle2 className="h-6 w-6 flex-shrink-0 mt-1" />
                  <span>FREE PROTEIN POWDER SUPPLEMENT</span>
                </li>
                <li className="flex items-start gap-3 text-white">
                  <CheckCircle2 className="h-6 w-6 flex-shrink-0 mt-1" />
                  <span>COMPLETE GYM MEMBERSHIP</span>
                </li>
                <li className="flex items-start gap-3 text-white">
                  <CheckCircle2 className="h-6 w-6 flex-shrink-0 mt-1" />
                  <span>OPEN 24/7 HOURS</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Member Us Section */}
      {/* <section className={`py-20 lg:py-32 ${isDark ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-4xl sm:text-5xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
              MEMBER US
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { name: 'John Doe', role: 'Trainer', image: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=400&q=80' },
              { name: 'Jane Smith', role: 'Manager', image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&q=80' },
              { name: 'Mike Johnson', role: 'Coach', image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&q=80' },
              { name: 'Sarah Williams', role: 'Trainer', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80' },
              { name: 'Tom Brown', role: 'Instructor', image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&q=80' },
              { name: 'Emma Davis', role: 'Trainer', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&q=80' },
              { name: 'Chris Wilson', role: 'Coach', image: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=400&q=80' },
              { name: 'Lisa Anderson', role: 'Manager', image: 'https://images.unsplash.com/photo-1550345332-09e3ac987658?w=400&q=80' },
            ].map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className={`w-24 h-24 mx-auto rounded-full overflow-hidden mb-4 ${
                  index < 4 ? 'ring-4 ring-gray-300' : 'ring-4 ring-orange-500'
                }`}>
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-1`}>{member.name}</h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Contact Section */}
      <section id="contact" className={`py-20 lg:py-32 ${isDark ? 'bg-gray-800' : 'bg-white'} transition-colors duration-300`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-orange-600 to-orange-500 rounded-3xl p-8 lg:p-16 text-center"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Ready to Transform Your Gym Management?
            </h2>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              Start with a 1-month free trial, then continue at just $20/month. Need something custom? We build tailored solutions for your specific needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth?mode=register">
                <Button className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-6 text-lg font-semibold">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a href="mailto:contact@gymflow.com">
                <Button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-orange-600 px-8 py-6 text-lg font-semibold">
                  Contact for Custom Software
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`${isDark ? 'bg-gray-900' : 'bg-gray-100'} py-12 transition-colors duration-300`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl font-bold">
                  <span className={isDark ? 'text-white' : 'text-gray-900'}>Gym</span>
                  <span className="text-orange-500">Manager</span>
                </span>
              </div>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                Complete gym management solution for modern fitness businesses.
              </p>
            </div>
            
            <div>
              <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>Product</h3>
              <ul className="space-y-2">
                <li><a href="#program" className={`${isDark ? 'text-gray-400 hover:text-orange-500' : 'text-gray-600 hover:text-orange-500'} text-sm`}>Programs</a></li>
                <li><a href="#pricing" className={`${isDark ? 'text-gray-400 hover:text-orange-500' : 'text-gray-600 hover:text-orange-500'} text-sm`}>Pricing</a></li>
                <li><Link to="/auth" className={`${isDark ? 'text-gray-400 hover:text-orange-500' : 'text-gray-600 hover:text-orange-500'} text-sm`}>Features</Link></li>
                <li><Link to="/auth" className={`${isDark ? 'text-gray-400 hover:text-orange-500' : 'text-gray-600 hover:text-orange-500'} text-sm`}>Demo</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>About Us</h3>
              <ul className="space-y-2">
                <li><a href="#contact" className={`${isDark ? 'text-gray-400 hover:text-orange-500' : 'text-gray-600 hover:text-orange-500'} text-sm`}>Company</a></li>
                <li><a href="#contact" className={`${isDark ? 'text-gray-400 hover:text-orange-500' : 'text-gray-600 hover:text-orange-500'} text-sm`}>Careers</a></li>
                <li><a href="#contact" className={`${isDark ? 'text-gray-400 hover:text-orange-500' : 'text-gray-600 hover:text-orange-500'} text-sm`}>Support</a></li>
                <li><a href="#contact" className={`${isDark ? 'text-gray-400 hover:text-orange-500' : 'text-gray-600 hover:text-orange-500'} text-sm`}>Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className={`mt-12 pt-8 ${isDark ? 'border-gray-800' : 'border-gray-300'} border-t flex flex-col sm:flex-row items-center justify-between gap-4`}>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              © 2024 GymManager. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className={`${isDark ? 'text-gray-400 hover:text-orange-500' : 'text-gray-600 hover:text-orange-500'} text-sm`}>Privacy Policy</a>
              <a href="#" className={`${isDark ? 'text-gray-400 hover:text-orange-500' : 'text-gray-600 hover:text-orange-500'} text-sm`}>Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;