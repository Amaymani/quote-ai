"use client";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Facebook, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="w-full border-t border-border bg-background/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8 text-center md:text-left">
          {/* Logo / About */}
          <div className="space-y-3 animate-fadeInUp">
            <h2 className="text-2xl font-semibold text-foreground tracking-wide">
              Quote<span className="text-primary">.ai</span>
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Get your quotations in <span className="font-medium text-primary">minutes</span>,
              not days.  
              AI-powered platform to generate accurate quotations and estimates instantly.
            </p>
            <div className="flex justify-center md:justify-start space-x-4 pt-2">
              <Link href="https://twitter.com" className="hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="https://facebook.com" className="hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="https://linkedin.com" className="hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 animate-fadeInUp delay-100">
            <h3 className="text-lg font-medium text-foreground">Quick Links</h3>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/create-quote" className="hover:text-primary transition-colors">
                  Create a Quote
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-primary transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/inventory" className="hover:text-primary transition-colors">
                  Inventory
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-primary transition-colors">
                  Sign Out
                </Link>
              </li>
            </ul>
          </div>

          {/* How It Works */}
          <div className="space-y-4 animate-fadeInUp delay-200">
            <h3 className="text-lg font-medium text-foreground">How It Works</h3>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li>1. Manage your inventory</li>
              <li>2. Fill in quotation details</li>
              <li>3. Get AI-generated PDF instantly</li>
            </ul>
          </div>

          {/* CTA */}
          <div className="flex flex-col items-center md:items-start justify-center space-y-4 animate-fadeInUp delay-300">
            <p className="text-lg font-semibold text-foreground text-center md:text-left">
              Get Started Today
            </p>
            <p className="text-sm text-muted-foreground text-center md:text-left">
              Create your first AI-powered quotation in minutes.
            </p>
            <Button asChild className="w-fit mt-2 bg-primary hover:opacity-90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-300">
              <Link href="/create-quote">Get Quote</Link>
            </Button>
          </div>
        </div>

        {/* Divider */}
        <Separator className="my-10 bg-border/50" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left text-sm text-muted-foreground gap-4">
          <p>© {new Date().getFullYear()} Quote.ai — All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
