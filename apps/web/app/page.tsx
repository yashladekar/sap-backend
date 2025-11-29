import Link from "next/link";
import { Button } from "@workspace/ui/components/button";
import { Shield, Users, Lock, Zap } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">AuthSystem</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold tracking-tight">
            Production-Grade
            <span className="text-primary"> Authentication</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            A complete authentication and authorization system built with Better Auth,
            Prisma, Express, Next.js, and shadcn/ui with Role-Based Access Control (RBAC).
          </p>
          <div className="flex justify-center gap-4 pt-6">
            <Link href="/register">
              <Button size="lg">Create Account</Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <FeatureCard
            icon={<Lock className="h-10 w-10" />}
            title="Secure Authentication"
            description="Email/password authentication with secure session management, 
            email verification, and password reset functionality."
          />
          <FeatureCard
            icon={<Users className="h-10 w-10" />}
            title="Role-Based Access Control"
            description="Comprehensive RBAC with Super Admin, Admin, Manager, User, 
            and Guest roles with granular permissions."
          />
          <FeatureCard
            icon={<Zap className="h-10 w-10" />}
            title="OAuth Providers"
            description="Support for social authentication with Google and GitHub 
            for a seamless login experience."
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t mt-20">
        <div className="text-center text-muted-foreground">
          <p>Built with Better Auth, Prisma, Express, Next.js, and shadcn/ui</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 rounded-lg border bg-card text-card-foreground">
      <div className="text-primary mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
