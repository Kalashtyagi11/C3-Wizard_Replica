import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Users, Shield, Calculator, ArrowRight } from 'lucide-react';

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary">C3 Wizard</h1>
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 gradient-sidebar text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            C3 Wizard
          </h1>
          <p className="text-xl md:text-2xl text-sidebar-foreground/90 mb-8 max-w-2xl mx-auto">
            Streamlined Social Security Contribution Management for St. Kitts & Nevis
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Create Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent border-white/30 text-white hover:bg-white/10">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose C3 Wizard?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Simplify your C3 form submissions with our secure, efficient platform designed for employers and self-employed individuals.
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Easy C3 Forms</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Generate and submit C3 forms quickly with our intuitive interface
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Employee Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Manage all your employees and their contribution details in one place
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Calculator className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Auto Calculations</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Automatic calculation of SS, EI, Levy, and PE contributions
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Secure & Compliant</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Bank-level security and full compliance with BIMA requirements
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Join employers and self-employed individuals across St. Kitts & Nevis who trust C3 Wizard for their contribution management.
          </p>
          <Link to="/signup">
            <Button size="lg">
              Create Your Free Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} C3 Wizard. All rights reserved.
            </div>
            <div className="text-sm text-muted-foreground">
              St. Christopher & Nevis Social Security Board
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
