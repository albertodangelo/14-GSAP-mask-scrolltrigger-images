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

    // Eigene Split-Funktion
    function splitTextToChars(element) {
        const text = element.textContent;
        element.innerHTML = '';
        
        const chars = text.split('').map(char => {
            // Wrapper für Overflow Masking
            const wrapper = document.createElement('div');
            wrapper.style.display = 'inline-block';
            wrapper.style.overflow = 'hidden';
            wrapper.style.verticalAlign = 'top';
            
            // Char Span
            const charSpan = document.createElement('span');
            charSpan.style.display = 'inline-block';
            charSpan.style.willChange = 'transform';
            charSpan.textContent = char === ' ' ? '\u00A0' : char;
            
            wrapper.appendChild(charSpan);
            element.appendChild(wrapper);
            
            return charSpan;
        });
        
        return chars;
    }

    // Your GSAP animation code here
    gsap.utils.toArray('.work-item').forEach((element, index) => {
        const img = element.querySelector('.work-item-img');
        const nameH1 = element.querySelector('.work-item-name h1');

        const chars = splitTextToChars(nameH1);

        
        // Text Animation - Chars beim Scrollen
        gsap.fromTo(chars,
            {       
                yPercent: 100
            },
            {               
                yPercent: 0,
                ease: "power2.out",
                stagger: 0.05,          
                scrollTrigger: {
                    trigger: element,
                    start: "top 90%",   
                    end: "bottom 55%",
                    scrub: 1
                }
            }
        );


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