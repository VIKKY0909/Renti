"use client"

import { motion } from "framer-motion"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export default function FAQContent() {
  const [searchQuery, setSearchQuery] = useState("")

  const faqs = [
    {
      category: "Renting",
      questions: [
        {
          question: "How does renting work on Rentimade?",
          answer:
            "Browse our collection, select your desired outfit, choose your rental dates, and place your order. We'll deliver the outfit to your doorstep, professionally cleaned and ready to wear. After your event, simply return it using our prepaid return label.",
        },
        {
          question: "What is the rental duration?",
          answer:
            "Standard rental periods are 3, 5, 7, or 10 days. You can select your preferred duration during checkout. If you need to extend your rental, contact us at least 24 hours before your return date.",
        },
        {
          question: "How much does it cost to rent?",
          answer:
            "Rental prices vary by outfit and typically range from 10-20% of the retail price. You'll also pay a refundable security deposit that's returned after the outfit is returned in good condition.",
        },
        {
          question: "What if the outfit doesn't fit?",
          answer:
            "We provide detailed size charts and measurements for each outfit. If you're unsure about sizing, contact us before ordering. We offer hassle-free exchanges if the outfit doesn't fit, subject to availability.",
        },
        {
          question: "How is the outfit delivered?",
          answer:
            "We offer doorstep delivery across India. Outfits are delivered in premium packaging, professionally dry-cleaned and quality-checked. Delivery typically takes 2-3 business days.",
        },
      ],
    },
    {
      category: "Lending",
      questions: [
        {
          question: "How can I lend my outfits?",
          answer:
            'Click on "Lend Your Dress" in the navigation menu, fill out the listing form with outfit details and photos, and submit for review. Once approved, your outfit will be live on our platform.',
        },
        {
          question: "How much can I earn?",
          answer:
            "You set your own rental price. Most lenders earn 60-80% of the rental price per transaction. Your earnings depend on the outfit's brand, condition, and demand.",
        },
        {
          question: "What happens if my outfit gets damaged?",
          answer:
            "All rentals are covered by our comprehensive insurance. If an outfit is damaged beyond normal wear and tear, the renter pays for repairs or replacement from their security deposit.",
        },
        {
          question: "When do I receive payment?",
          answer:
            "Payments are processed within 3-5 business days after the outfit is returned and inspected. Funds are transferred directly to your registered bank account.",
        },
        {
          question: "Can I remove my listing anytime?",
          answer:
            "Yes, you can pause or remove your listings anytime from your dashboard. However, you must honor any confirmed bookings.",
        },
      ],
    },
    {
      category: "Quality & Safety",
      questions: [
        {
          question: "How do you ensure outfit quality?",
          answer:
            "Every outfit undergoes professional dry-cleaning and thorough quality inspection before and after each rental. We check for stains, damages, and overall condition to maintain premium standards.",
        },
        {
          question: "Is my payment information secure?",
          answer:
            "Yes, we use industry-standard encryption and secure payment gateways. We never store your complete card details on our servers.",
        },
        {
          question: "What is your hygiene protocol?",
          answer:
            "All outfits are professionally dry-cleaned using eco-friendly methods before each rental. We follow strict hygiene protocols and quality checks to ensure every outfit is fresh and pristine.",
        },
      ],
    },
    {
      category: "Returns & Refunds",
      questions: [
        {
          question: "How do I return the outfit?",
          answer:
            "Use the prepaid return label included with your delivery. Pack the outfit in the original packaging and drop it at any courier pickup point. You can also schedule a pickup from your location.",
        },
        {
          question: "What is your cancellation policy?",
          answer:
            "Free cancellation up to 48 hours before delivery. Cancellations within 48 hours incur a 25% fee. No refunds after delivery unless there's a quality issue.",
        },
        {
          question: "When will I get my security deposit back?",
          answer:
            "Security deposits are refunded within 3-5 business days after the outfit is returned and inspected. If there are damages, the repair cost is deducted from the deposit.",
        },
        {
          question: "What if I return the outfit late?",
          answer:
            "Late returns incur a daily fee of 20% of the rental price. Please contact us if you need to extend your rental period before the return date.",
        },
      ],
    },
  ]

  const filteredFAQs = faqs.map((category) => ({
    ...category,
    questions: category.questions.filter(
      (q) =>
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  }))

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10" />
        <div className="container mx-auto max-w-4xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-balance mb-6 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Frequently Asked Questions
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto text-balance leading-relaxed mb-8">
              Find answers to common questions about renting and lending on Rentimade
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-6 text-lg"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          {filteredFAQs.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
              className="mb-12"
            >
              {category.questions.length > 0 && (
                <>
                  <h2 className="font-serif text-3xl md:text-4xl mb-6 text-balance">{category.category}</h2>
                  <Accordion type="single" collapsible className="space-y-4">
                    {category.questions.map((faq, index) => (
                      <AccordionItem
                        key={index}
                        value={`${category.category}-${index}`}
                        className="bg-card border border-border rounded-xl px-6 hover:border-primary/50 transition-colors"
                      >
                        <AccordionTrigger className="text-left font-medium text-lg py-6 hover:no-underline">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </>
              )}
            </motion.div>
          ))}

          {filteredFAQs.every((cat) => cat.questions.length === 0) && (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground">No results found for "{searchQuery}"</p>
            </div>
          )}
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-serif text-4xl md:text-5xl mb-6 text-balance">Still Have Questions?</h2>
            <p className="text-xl text-muted-foreground mb-8 text-balance">
              Our support team is here to help you with any queries
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="px-8 py-4 bg-gradient-to-r from-primary to-accent text-white rounded-full font-medium hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                Contact Us
              </a>
              <a
                href="tel:+917724023688"
                className="px-8 py-4 bg-card border-2 border-primary rounded-full font-medium hover:bg-primary/10 transition-all duration-300"
              >
                Call: +91 7724023688
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
