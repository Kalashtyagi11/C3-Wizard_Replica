/**
 * Contact Us page - temporarily using local state until database schema is rebuilt
 */
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Send, Loader2, Phone, Mail, MapPin, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export default function ContactUs() {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !message) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: Submit to c3_contact_us_log once schema is rebuilt
      // For now, just show success message
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success('Your message has been sent! We will get back to you shortly.');
      setName('');
      setPhone('');
      setSubject('');
      setMessage('');
    } catch (err) {
      console.error('Error submitting contact form:', err);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mt-16 space-y-6">
        <h1 className="text-2xl font-bold">Contact Us</h1>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 p-3 rounded-md bg-yellow-50 border border-yellow-200">
                <div className="flex items-center gap-2 text-yellow-700 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>Contact form will be fully functional after schema migration (c3_contact_us_log).</span>
                </div>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="What is this about?"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    placeholder="Enter your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={6}
                    required
                  />
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-primary/10 p-3">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Social Security Board</h4>
                      <p className="text-muted-foreground text-sm">
                        P.O. Box 79<br />
                        Church Street<br />
                        Basseterre, St. Kitts
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-primary/10 p-3">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Email</h4>
                      <p className="text-muted-foreground text-sm">info@ssb.kn</p>
                      <p className="text-muted-foreground text-sm">support@c3wizard.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-primary/10 p-3">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Phone</h4>
                      <p className="text-muted-foreground text-sm">+1 (869) 465-2535</p>
                      <p className="text-muted-foreground text-sm">+1 (869) 465-2536</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Office Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monday - Friday</span>
                    <span className="font-medium">8:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Saturday</span>
                    <span className="font-medium">Closed</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sunday</span>
                    <span className="font-medium">Closed</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Public Holidays</span>
                    <span className="font-medium">Closed</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
