import { useState, useEffect, useCallback } from 'react';
import { getexpiredsub } from '../../services/allapi';
import { useNavigate } from 'react-router-dom';

const Expiringsubscription = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [subscriptions, setSubscriptions] = useState([]);
    const navigate = useNavigate();
    
    // Fetch data without loading state
    useEffect(() => {
        const fetchSubscriptions = async () => {
            try {
                const response = await getexpiredsub();
                console.log("expires",response);
                
                setSubscriptions(response || []);
            } catch (error) {
                console.error("Error fetching subscription data:", error);
                setSubscriptions([]);
            }
        };

        fetchSubscriptions();
    }, []);
    
    const nextSlide = useCallback(() => {
        setActiveIndex((current) =>
            current === subscriptions.length - 1 ? 0 : current + 1
        );
    }, [subscriptions.length]);

    const prevSlide = () => {
        setActiveIndex((current) =>
            current === 0 ? subscriptions.length - 1 : current - 1
        );
    };

    // Auto-slide functionality
    useEffect(() => {
        // Only set up auto-slide if we have multiple subscriptions
        if (subscriptions.length <= 1) return;
        
        // Change slide every 5 seconds
        const slideInterval = setInterval(() => {
            nextSlide();
        },5000); // 5000ms = 5 seconds
        
        // Clean up interval on component unmount or when dependencies change
        return () => clearInterval(slideInterval);
    }, [nextSlide, subscriptions.length]);

    // If no subscriptions, show compact message
    if (!subscriptions || subscriptions.length === 0) {
        return (
            <div className="w-full bg-[#EEC8C5] rounded-lg p-3 text-center mb-4">
                <p className="text-sm text-[#C25E5E]">No expiring subscriptions</p>
            </div>
        );
    }

    return (
        <div className="relative w-full max-w-full overflow-hidden mb-2">
            {/* More compact carousel container */}
            <div className="relative w-full h-48 sm:h-52 md:h-56">
                {subscriptions.map((subscription, index) => (
                    <div
                        key={index}
                        className={`absolute w-full h-full transition-all duration-300 ease-in-out ${
                            index === activeIndex
                                ? "opacity-100 translate-x-0"
                                : index < activeIndex
                                    ? "opacity-0 -translate-x-full"
                                    : "opacity-0 translate-x-full"
                        }`}
                    >
                        <div className="w-full h-full rounded-lg shadow-md flex flex-col items-center justify-center p-3 bg-[#EEC8C5]">
                            {/* Counter - Smaller and more subtle */}
                            <div className="mr-0 ml-auto text-xs text-white mb-1 rounded-full px-2 py-0.5 bg-[#C25E5E]/30">
                                {activeIndex + 1}/{subscriptions.length}
                            </div>
                            
                            {/* Heading - Smaller */}
                            <h2 className="text-[#C25E5E] text-xl sm:text-2xl font-bold mb-2 text-center">
                                EXPIRING SOON!
                            </h2>

                            {/* Content - More compact */}
                            <h3 className="text-base sm:text-lg font-bold mb-1 text-center">
                                {subscription.name}
                            </h3>
                            <p className="text-sm sm:text-base mb-1 text-center">
                                Next Payment: {subscription.next_payment_date}
                            </p>
                            <p className="text-sm sm:text-base mb-2 text-center">
                                Amount: ₹{subscription.cost}
                            </p>

                            {/* Button - Smaller */}
                            <button 
                                className="bg-white text-[#C25E5E] py-1 px-3 rounded text-sm sm:text-base font-bold hover:bg-gray-100 transition"
                                onClick={() => { 
                                    navigate('/dashboard/subscriptions/Viewdetails', { 
                                      state: { subscription: subscription } 
                                    }) 
                                  }}
                            >
                                VIEW
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Arrows - Smaller and more subtle */}
            {subscriptions.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-1 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-[#C25E5E] p-1 rounded-full transition"
                        aria-label="Previous slide"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <button
                        onClick={nextSlide}
                        className="absolute right-1 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-[#C25E5E] p-1 rounded-full transition"
                        aria-label="Next slide"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </>
            )}

            {/* Indicator dots - Smaller */}
            {subscriptions.length > 1 && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex space-x-1">
                    {subscriptions.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveIndex(index)}
                            className={`w-1.5 h-1.5 rounded-full transition-all ${
                                index === activeIndex ? "bg-[#C25E5E]" : "bg-white/60"
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Expiringsubscription;