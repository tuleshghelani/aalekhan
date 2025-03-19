import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GalleryEffectsService {
  
  // Add subtle floating particles to the gallery background
  addParticleEffects(container: HTMLElement): void {
    if (!container) return;
    
    // Number of particles based on container size
    const particleCount = Math.min(Math.floor(container.clientWidth / 50), 30);
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.classList.add('gallery-particle');
      
      // Random position
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      
      // Random size
      const size = 3 + Math.random() * 7;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      // Random animation duration and delay
      const duration = 15 + Math.random() * 20;
      const delay = Math.random() * 10;
      particle.style.animation = `floatParticle ${duration}s ease-in-out ${delay}s infinite alternate`;
      
      container.appendChild(particle);
    }
  }
  
  // Clean up any created particles when no longer needed
  removeParticleEffects(container: HTMLElement): void {
    if (!container) return;
    
    const particles = container.querySelectorAll('.gallery-particle');
    particles.forEach(particle => {
      container.removeChild(particle);
    });
  }
} 