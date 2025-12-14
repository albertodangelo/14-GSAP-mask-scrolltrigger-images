import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

document.addEventListener('DOMContentLoaded', () => {

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis();

    lenis.on('scroll', () => {
        ScrollTrigger.update();
    });
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Scroll Indicator Animation - fade out on scroll
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        gsap.to(scrollIndicator, {
            opacity: 0,
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });
    }

    // Your GSAP animation code here
    gsap.utils.toArray('.work-item').forEach((element, index) => {
        const img = element.querySelector('.work-item-img');
        const nameH1 = element.querySelector('.work-item-name h1');

        // Manual text split that respects word boundaries
        const originalText = nameH1.textContent;
        const words = originalText.trim().split(/\s+/);
        nameH1.innerHTML = '';
        
        const chars = [];
        
        words.forEach((word, wordIndex) => {
            // Create word wrapper
            const wordSpan = document.createElement('span');
            wordSpan.style.display = 'inline-block';
            wordSpan.style.whiteSpace = 'nowrap';
            
            // Split word into chars
            word.split('').forEach((char) => {
                const charSpan = document.createElement('span');
                charSpan.className = 'char';
                charSpan.style.display = 'inline-block';
                charSpan.textContent = char;
                wordSpan.appendChild(charSpan);
                chars.push(charSpan);
            });
            
            nameH1.appendChild(wordSpan);
            
            // Add space between words (not after last word)
            if (wordIndex < words.length - 1) {
                nameH1.appendChild(document.createTextNode(' '));
            }
        });
        
        // Set initial state
        gsap.set(chars, { opacity: 0, y: 50 });
        
        // Text Animation - Chars beim Scrollen
        gsap.to(chars, {
            opacity: 1,
            y: 0,
            stagger: 0.03,
            ease: "none",
            scrollTrigger: {
                trigger: nameH1,
                start: "top 85%",
                end: "top 40%",
                scrub: 1,
                markers: false
            }
        });


        // Image Animation - Clip-Path beim Scrollen
        // Timeline für beide Richtungen
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: element,
                start: "top bottom",
                end: "bottom top",
                scrub: 1
            }
        });

        // Erste Hälfte: Öffnen des Clip-Paths
        tl.fromTo(img,
            {
                clipPath: "polygon(25% 25%, 75% 40%, 100% 100%, 0% 100%)"
            },
            {
                clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                ease: "none",
                duration: 0.5
            }
        )
        // Zweite Hälfte: Schließen mit umgekehrtem Effekt (von unten)
        .to(img, {
            clipPath: "polygon(0% 0%, 100% 0%, 75% 60%, 25% 75%)",
            ease: "none",
            duration: 0.5
        });
       
        
    });
});