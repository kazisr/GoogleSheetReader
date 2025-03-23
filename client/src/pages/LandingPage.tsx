import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { CheckCircle2, UserPlus, Database, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header onRefresh={() => {}} />
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-primary/90 to-primary/50 text-white">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              Project Registration Manager
            </h1>
            <p className="mt-6 max-w-2xl text-xl">
              Streamlined project registration and management system for students and administrators.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link href="/register">
                <Button size="lg" className="font-semibold flex items-center gap-2">
                  Register Now <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/data">
                <Button variant="outline" size="lg" className="bg-white/10 text-white border-white/20 hover:bg-white/20 font-semibold flex items-center gap-2">
                  View Projects <Database className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900">
                Streamlined Registration Process
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                Everything you need to register and manage student projects in one place.
              </p>
            </div>

            <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-3">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-100 flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full text-primary">
                  <UserPlus className="h-8 w-8" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Simple Registration</h3>
                <p className="mt-2 text-gray-500">
                  Register your team and project details through our user-friendly form.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-100 flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full text-primary">
                  <Database className="h-8 w-8" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Data Management</h3>
                <p className="mt-2 text-gray-500">
                  All project information is securely stored and easily accessible.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-100 flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full text-primary">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Validation</h3>
                <p className="mt-2 text-gray-500">
                  Automatic data validation ensures accurate and complete information.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Ready to register your project?
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Get started with our simple registration process today.
            </p>
            <div className="mt-8">
              <Link href="/register">
                <Button size="lg" className="font-semibold">
                  Register Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}