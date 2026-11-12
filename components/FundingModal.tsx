"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Bitcoin, CreditCard, DollarSign, Landmark, Shield, Star } from "lucide-react"
import Image from "next/image"

const fundingTiers = [
  {
    id: "tier1",
    name: "Supporter",
    amount: 100,
    benefits: ["Early access to project updates", "Name in contributors list"],
    icon: <Star className="h-5 w-5 text-yellow-500" />,
  },
  {
    id: "tier2",
    name: "Backer",
    amount: 500,
    benefits: ["All Supporter benefits", "Exclusive monthly newsletter", "Digital badge for your profile"],
    icon: <Star className="h-5 w-5 text-primary" />,
  },
  {
    id: "tier3",
    name: "Investor",
    amount: 1000,
    benefits: [
      "All Backer benefits",
      "Quarterly virtual meetings with the team",
      "Early access to beta features",
      "Voting rights on certain project decisions",
    ],
    icon: <Star className="h-5 w-5 text-primary" />,
  },
  {
    id: "tier4",
    name: "Partner",
    amount: 5000,
    benefits: [
      "All Investor benefits",
      "Your name/logo on project website",
      "Direct communication channel with founders",
      "Personalized project consultation session",
    ],
    icon: <Star className="h-5 w-5 text-primary" />,
  },
]

const cryptoOptions = [
  { id: "eth", name: "Ethereum (ETH)", icon: "/placeholder.svg?height=30&width=30", address: "0x1234...5678" },
  { id: "btc", name: "Bitcoin (BTC)", icon: "/placeholder.svg?height=30&width=30", address: "bc1q...xyz" },
  { id: "usdc", name: "USD Coin (USDC)", icon: "/placeholder.svg?height=30&width=30", address: "0xabcd...efgh" },
  { id: "sol", name: "Solana (SOL)", icon: "/placeholder.svg?height=30&width=30", address: "sol1...abc" },
]

export default function FundingModal({ project, open, onOpenChange }) {
  const [fundingAmount, setFundingAmount] = useState(fundingTiers[0].amount)
  const [selectedTier, setSelectedTier] = useState(fundingTiers[0].id)
  const [customAmount, setCustomAmount] = useState("")
  const [selectedCrypto, setSelectedCrypto] = useState(cryptoOptions[0].id)
  const [paymentStep, setPaymentStep] = useState(1)

  const handleTierSelect = (tierId) => {
    const tier = fundingTiers.find((t) => t.id === tierId)
    setSelectedTier(tierId)
    setFundingAmount(tier.amount)
    setCustomAmount("")
  }

  const handleCustomAmountChange = (e) => {
    setCustomAmount(e.target.value)
    setFundingAmount(Number(e.target.value))
    setSelectedTier("")
  }

  const handleCryptoSelect = (cryptoId) => {
    setSelectedCrypto(cryptoId)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // In a real app, this would process the payment
    setPaymentStep(2)
  }

  const resetModal = () => {
    setPaymentStep(1)
    setSelectedTier(fundingTiers[0].id)
    setFundingAmount(fundingTiers[0].amount)
    setCustomAmount("")
    setSelectedCrypto(cryptoOptions[0].id)
  }

  const handleClose = () => {
    resetModal()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] glass border-border/30 overflow-hidden">
        {paymentStep === 1 ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">Fund {project.name}</DialogTitle>
              <DialogDescription>
                Support this project by contributing funds. Choose a tier or enter a custom amount.
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="tiers" className="mt-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="tiers">
                  <Shield className="h-4 w-4 mr-2" />
                  Funding Tiers
                </TabsTrigger>
                <TabsTrigger value="crypto">
                  <Bitcoin className="h-4 w-4 mr-2" />
                  Cryptocurrency
                </TabsTrigger>
                <TabsTrigger value="card">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Card Payment
                </TabsTrigger>
              </TabsList>

              {/* Funding Tiers Tab */}
              <TabsContent value="tiers" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fundingTiers.map((tier) => (
                    <div
                      key={tier.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedTier === tier.id
                          ? "border-primary bg-primary/10"
                          : "border-border/30 hover:border-primary/50"
                      }`}
                      onClick={() => handleTierSelect(tier.id)}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          {tier.icon}
                          <h3 className="font-medium ml-2">{tier.name}</h3>
                        </div>
                        <span className="text-lg font-bold">${tier.amount}</span>
                      </div>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {tier.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-primary mr-2">•</span>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <Label htmlFor="custom-amount">Or enter a custom amount</Label>
                  <div className="flex items-center mt-2">
                    <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Input
                      id="custom-amount"
                      type="number"
                      min="1"
                      placeholder="Enter amount"
                      value={customAmount}
                      onChange={handleCustomAmountChange}
                    />
                  </div>
                </div>

                <div className="mt-6 p-4 bg-primary/5 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Contribution:</span>
                    <span className="text-xl font-bold">${fundingAmount || 0}</span>
                  </div>
                </div>
              </TabsContent>

              {/* Cryptocurrency Tab */}
              <TabsContent value="crypto" className="space-y-4 mt-4">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label>Select cryptocurrency</Label>
                    <RadioGroup
                      defaultValue={cryptoOptions[0].id}
                      onValueChange={handleCryptoSelect}
                      className="grid grid-cols-1 gap-2"
                    >
                      {cryptoOptions.map((crypto) => (
                        <label
                          key={crypto.id}
                          className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${
                            selectedCrypto === crypto.id
                              ? "border-primary bg-primary/10"
                              : "border-border/30 hover:border-primary/50"
                          }`}
                        >
                          <RadioGroupItem value={crypto.id} id={crypto.id} />
                          <div className="flex items-center flex-1">
                            <div className="relative h-6 w-6 mr-3">
                              <Image
                                src={crypto.icon || "/placeholder.svg"}
                                alt={crypto.name}
                                fill
                                className="object-contain"
                              />
                            </div>
                            <span>{crypto.name}</span>
                          </div>
                        </label>
                      ))}
                    </RadioGroup>
                  </div>

                  <div className="mt-4">
                    <Label htmlFor="crypto-amount">Amount to contribute</Label>
                    <div className="flex items-center mt-2">
                      <Input
                        id="crypto-amount"
                        type="number"
                        min="1"
                        placeholder="Enter amount in USD"
                        value={customAmount || fundingAmount}
                        onChange={handleCustomAmountChange}
                      />
                      <span className="ml-2">USD</span>
                    </div>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg mt-4">
                    <Label className="mb-2 block">Send to this address:</Label>
                    <div className="flex items-center justify-between p-2 bg-background rounded border border-border">
                      <code className="text-sm truncate">
                        {cryptoOptions.find((c) => c.id === selectedCrypto)?.address}
                      </code>
                      <Button variant="ghost" size="sm" className="ml-2">
                        Copy
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Send exactly ${fundingAmount || 0} worth of{" "}
                      {cryptoOptions.find((c) => c.id === selectedCrypto)?.name} to this address.
                    </p>
                  </div>
                </div>
              </TabsContent>

              {/* Card Payment Tab */}
              <TabsContent value="card" className="space-y-4 mt-4">
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <Label htmlFor="card-name">Cardholder Name</Label>
                        <Input id="card-name" placeholder="John Doe" required className="mt-1" />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="card-number">Card Number</Label>
                        <Input id="card-number" placeholder="1234 5678 9012 3456" required className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" required className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="cvc">CVC</Label>
                        <Input id="cvc" placeholder="123" required className="mt-1" />
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div>
                      <Label htmlFor="card-amount">Amount to contribute</Label>
                      <div className="flex items-center mt-1">
                        <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                        <Input
                          id="card-amount"
                          type="number"
                          min="1"
                          placeholder="Enter amount"
                          value={customAmount || fundingAmount}
                          onChange={handleCustomAmountChange}
                          required
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <div className="p-4 bg-primary/5 rounded-lg mt-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total Contribution:</span>
                        <span className="text-xl font-bold">${fundingAmount || 0}</span>
                      </div>
                    </div>
                  </div>

                  <DialogFooter className="mt-6">
                    <Button type="submit" className="w-full">
                      <Landmark className="h-4 w-4 mr-2" />
                      Complete Payment
                    </Button>
                  </DialogFooter>
                </form>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <>
            <div className="flex flex-col items-center justify-center py-8">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
              <p className="text-center text-muted-foreground mb-6">
                Your contribution of ${fundingAmount} to {project.name} has been received.
              </p>
              <p className="text-center text-sm mb-6">
                You will receive a confirmation email shortly with details of your contribution.
              </p>
              <Button onClick={handleClose}>Close</Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

