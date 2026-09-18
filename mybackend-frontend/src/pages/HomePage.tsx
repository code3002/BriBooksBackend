import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    Book,
    PenTool,
    Rocket,
    Sparkles,
    Trophy,
    Coins,
    Medal,
    Globe,
} from 'lucide-react';
import { Button } from '../components/ui/Button';

export const HomePage: React.FC = () => {
    return (
        <div className="flex flex-col gap-20 pb-20">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/50 to-white pt-20 pb-32">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center rounded-full border border-indigo-100 bg-white px-3 py-1 text-sm font-medium text-indigo-600 shadow-sm"
                        >
                            <Sparkles className="mr-2 h-4 w-4 text-yellow-500" />
                            World's Leading Children's Book Publishing Platform
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-5xl md:text-7xl font-display font-bold tracking-tight text-slate-900"
                        >
                            Turn Your Child into a <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                                Published Author
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-xl text-slate-600 max-w-2xl"
                        >
                            Empower your child to write, illustrate, publish, and sell their own books globally. Unleash their creativity with our AI-powered writing assistant.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex flex-col sm:flex-row gap-4 w-full justify-center"
                        >
                            <Link to="/start-writing">
                                <Button size="lg" className="w-full sm:w-auto gap-2">
                                    Start Writing for Free <ArrowRight className="h-5 w-5" />
                                </Button>
                            </Link>
                            <Link to="/books">
                                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                                    Explore Books
                                </Button>
                            </Link>
                        </motion.div>
                    </div>
                </div>

                {/* Decorative blobs */}
                <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl -z-10" />
                <div className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/4 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-3xl -z-10" />
            </section>

            {/* Trust Stats */}
            <section className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard label="Young Authors" value="Global" />
                    <StatCard label="Stories Written" value="Growing" />
                    <StatCard label="Books Published" value="Every Day" />
                </div>
            </section>

            {/* Features Section */}
            <section className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">
                        Why Kids Love BriBooks?
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        We provide the perfect platform for young storytellers to express themselves and share their imagination with the world.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={<PenTool className="h-8 w-8 text-primary" />}
                        title="AI Writing Assistant"
                        description="Our smart AI helps kids overcome writer's block and suggests creative ideas to keep the story flowing."
                        color="bg-indigo-50"
                    />
                    <FeatureCard
                        icon={<Book className="h-8 w-8 text-secondary" />}
                        title="Professional Publishing"
                        description="Get printed copies of your book delivered to your doorstep with professional binding and quality."
                        color="bg-pink-50"
                    />
                    <FeatureCard
                        icon={<Rocket className="h-8 w-8 text-accent" />}
                        title="Global Recognition"
                        description="Participate in global book fairs and get a chance to win awards and recognition for your writing."
                        color="bg-emerald-50"
                    />
                </div>
            </section>

            {/* How it Works */}
            <section className="bg-slate-50 py-20">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">
                            How It Works
                        </h2>
                        <p className="text-lg text-slate-600">
                            From idea to published book in 4 simple steps
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <StepCard number="1" title="Select Book Theme" description="Choose a theme or upload your own backgrounds." />
                        <StepCard number="2" title="AI Guided Writing" description="Get smart guidance from the first sentence to publish." />
                        <StepCard number="3" title="Earn Royalties" description="Sell your book and track your earnings." />
                        <StepCard number="4" title="Win Awards" description="Join fairs and competitions to get recognized." />
                    </div>
                </div>
            </section>

            {/* Awards & Recognition */}
            <section className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-10 items-center">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">
                            Win Recognition as a Young Author
                        </h2>
                        <p className="text-lg text-slate-600 mb-6">
                            Celebrate creativity with global contests, author
                            spotlights, and curated showcases that help young
                            writers shine.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <Badge label="Global Book Fairs" />
                            <Badge label="EdTech 50 Awards" />
                            <Badge label="Author Spotlights" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        <RecognitionCard
                            icon={<Trophy className="h-5 w-5" />}
                            title="EdTech 50 (2023-2025)"
                            description="Recognized for impact in learning and creativity."
                        />
                        <RecognitionCard
                            icon={<Medal className="h-5 w-5" />}
                            title="Amazon Gen-AI Excellence"
                            description="Celebrating innovation in creative education."
                        />
                        <RecognitionCard
                            icon={<Globe className="h-5 w-5" />}
                            title="Regional & Global Awards"
                            description="Showcased in international edtech competitions."
                        />
                    </div>
                </div>
            </section>

            {/* Royalties */}
            <section className="bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 py-20 text-white">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                            Earn Royalties As You Sell
                        </h2>
                        <p className="text-lg text-indigo-100 max-w-2xl mx-auto">
                            Royalties increase as your book reaches more readers.
                            Track your sales and celebrate each milestone.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <RoyaltyCard title="1-10" rate="5%" description="Start selling" />
                        <RoyaltyCard title="11-20" rate="10%" description="Momentum builds" />
                        <RoyaltyCard title="21-50" rate="15%" description="Growing readers" />
                        <RoyaltyCard title="51-100" rate="20%" description="Rising author" />
                        <RoyaltyCard title="101+" rate="25%" description="Top performer" />
                    </div>
                    <p className="mt-6 text-center text-sm text-indigo-100/80">
                        Royalties apply to books sold on the platform. Payouts and
                        promotions are subject to the current program rules.
                    </p>
                </div>
            </section>
        </div>
    );
};

const StatCard: React.FC<{ label: string; value: string }> = ({ label, value }) => {
    return (
        <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 text-center shadow-lg shadow-slate-200/50">
            <div className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-2">
                {value}
            </div>
            <div className="text-sm font-medium uppercase tracking-wide text-slate-500">
                {label}
            </div>
        </div>
    );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string; color: string }> = ({
    icon,
    title,
    description,
    color,
}) => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className={`p-8 rounded-3xl ${color} border border-transparent hover:border-slate-200 transition-all`}
        >
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
            <p className="text-slate-600 leading-relaxed">{description}</p>
        </motion.div>
    );
};

const Badge: React.FC<{ label: string }> = ({ label }) => {
    return (
        <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-700 shadow-sm">
            {label}
        </span>
    );
};

const RecognitionCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({
    icon,
    title,
    description,
}) => {
    return (
        <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-200/50">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
                {icon}
            </div>
            <div>
                <h3 className="font-semibold text-slate-900 mb-1">{title}</h3>
                <p className="text-sm text-slate-600">{description}</p>
            </div>
        </div>
    );
};

const RoyaltyCard: React.FC<{ title: string; rate: string; description: string }> = ({
    title,
    rate,
    description,
}) => {
    return (
        <div className="rounded-3xl border border-white/10 bg-white/10 p-6 text-center shadow-xl shadow-indigo-900/40">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white">
                <Coins className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <div className="text-2xl font-bold mb-2">{rate}</div>
            <p className="text-sm text-indigo-100">{description}</p>
        </div>
    );
};

const StepCard: React.FC<{ number: string; title: string; description: string }> = ({ number, title, description }) => {
    return (
        <div className="relative p-6 bg-white rounded-2xl shadow-sm border border-slate-100 text-center">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl border-4 border-slate-50">
                {number}
            </div>
            <h3 className="mt-8 text-lg font-bold text-slate-900 mb-2">{title}</h3>
            <p className="text-sm text-slate-600">{description}</p>
        </div>
    );
};
