'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const testimonials = [
  {
    id: 1,
    quote: "Collab Deck transformed how our team manages projects. We ditched Jira and never looked back.",
    author: "Sarah Chen",
    role: "Product Manager, TechStart",
    gradient: "from-emerald-400 to-cyan-600",
    emoji: "🚀",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  },
  {
    id: 2,
    quote: "Finally, a task manager that's both powerful and intuitive. Our entire team is more productive.",
    author: "Marcus Johnson",
    role: "Engineering Lead, DevCo",
    gradient: "from-purple-500 to-pink-600",
    emoji: "⚡",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
  },
  {
    id: 3,
    quote: "The fact that it's free AND powerful is almost unbelievable. Zero compromise on features.",
    author: "Emma Rodriguez",
    role: "Founder, Creative Studio",
    gradient: "from-blue-500 to-indigo-600",
    emoji: "✨",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
  },
  {
    id: 4,
    quote: "Best decision we made was switching to Collab Deck. Saves us thousands annually.",
    author: "Alex Kumar",
    role: "CTO, Growth Labs",
    gradient: "from-rose-500 to-orange-500",
    emoji: "💎",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  },
  {
    id: 5,
    quote: "The collaboration features are unmatched. Our remote team feels connected like never before.",
    author: "Lisa Wang",
    role: "Design Director, Creative Co",
    gradient: "from-teal-500 to-green-500",
    emoji: "🎨",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
  },
];

export default function TestimonialSlider() {
  const [current, setCurrent] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const goToPrevious = () => {
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlay(false);
  };

  const goToNext = () => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlay(false);
  };

  const goToSlide = (index: number) => {
    setCurrent(index);
    setIsAutoPlay(false);
  };

  return (
    <div className="w-full">
      {/* Main Slider */}
      <div className="relative h-96 sm:h-80 md:h-72 lg:h-80 perspective">
        <div className="relative w-full h-full overflow-hidden">
          {testimonials.map((testimonial, index) => {
            const isActive = index === current;
            const isPrev = index === (current - 1 + testimonials.length) % testimonials.length;
            const isNext = index === (current + 1) % testimonials.length;

            return (
              <div
                key={testimonial.id}
                className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                  isActive
                    ? 'opacity-100 scale-100 translate-x-0 z-20'
                    : isPrev
                    ? 'opacity-0 scale-95 -translate-x-full z-10'
                    : isNext
                    ? 'opacity-0 scale-95 translate-x-full z-10'
                    : 'opacity-0 scale-90 z-0'
                }`}
              >
                <div
                  className={`relative group overflow-hidden rounded-2xl p-8 sm:p-10 h-full bg-linear-to-br ${testimonial.gradient} shadow-2xl`}
                >
                  {/* Animated background elements */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>

                  {/* Glass effect overlay */}
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition backdrop-blur-sm"></div>

                  <div className="relative z-10 h-full flex flex-col justify-between">
                    {/* Top Section */}
                    <div>
                      {/* Rating Stars */} hallelujah
                      <div className="flex items-center gap-1 mb-6">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-white text-lg drop-shadow-lg">
                            ⭐
                          </span>
                        ))}
                      </div>

                      {/* Quote */}
                      <p className="text-white text-lg sm:text-xl font-medium leading-relaxed drop-shadow-lg">
                        "{testimonial.quote}"
                      </p>
                    </div>

                    {/* Bottom Section */}
                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/20">
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white/30 shadow-lg shrink-0">
                          <Image
                            src={testimonial.image}
                            alt={testimonial.author}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                        <div>
                          <p className="text-white font-semibold text-sm drop-shadow-lg">
                            {testimonial.author}
                          </p>
                          <p className="text-white/80 text-xs drop-shadow-lg">
                            {testimonial.role}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/90 hover:bg-white text-zinc-900 w-12 h-12 rounded-full flex items-center justify-center transition shadow-lg hover:shadow-xl"
          aria-label="Previous testimonial"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/90 hover:bg-white text-zinc-900 w-12 h-12 rounded-full flex items-center justify-center transition shadow-lg hover:shadow-xl"
          aria-label="Next testimonial"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Dot Indicators */}
      <div className="flex items-center justify-center gap-3 mt-8">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === current
                ? 'w-8 h-3 bg-emerald-600'
                : 'w-3 h-3 bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400 dark:hover:bg-zinc-600'
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>

      {/* Auto-play Toggle */}
      <div className="flex items-center justify-center mt-6">
        <button
          onClick={() => setIsAutoPlay(!isAutoPlay)}
          className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition"
        >
          {isAutoPlay ? '⏸️ Pause' : '▶️ Play'} autoplay
        </button>
      </div>
    </div>
  );
}
