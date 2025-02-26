import { Component, OnInit, AfterViewInit, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeadersComponent } from '../headers/headers.component';
import { RouterModule } from '@angular/router';

interface TeamMember {
  name: string;
  position: string;
  image: string;
}

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [CommonModule, HeadersComponent, RouterModule],
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit, AfterViewInit {
  teamMembers: TeamMember[] = [
    {
      name: 'Pujan Patel',
      position: 'Founder and CEO',
      image: '../../assets/team/pujan.jpg'
    },
    {
      name: 'Nikul Patel',
      position: 'Co-Founder',
      image: '../../assets/team/nikul.jpg'
    },
    {
      name: 'Radhika Varsani',
      position: 'Digital marketing head',
      image: '../../assets/team/rahika.jpg'
    },
    {
      name: 'Darshit sanghani',
      position: 'Graphics designer',
      image: '../../assets/team/darshit.jpg'
    },
    {
      name: 'Pooja anadkat',
      position: 'Graphics design',
      image: '../../assets/team/puja-anadkat.jpg'
    },
    {
      name: 'Rutvik Bhatt',
      position: 'Web Developer',
      image: '../../assets/team/rutvik-bhatt.jpg'
    },
    {
      name: 'Tulesh Ghelani',
      position: 'Web Developer',
      image: '../../assets/team/tulesh-ghelani.jpg'
    },
  ];

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.animateOnScroll();
  }

  animateOnScroll() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    }, { threshold: 0.3 });

    const teamMembers = document.querySelectorAll('.team-member');
    teamMembers.forEach((member) => {
      observer.observe(member);
    });
  }

  handleHeaderAction(action: string) {
    if (action === 'contact') {
      // Handle contact dialog
    } else if (action === 'about') {
      // Handle about dialog
    }
  }
}
