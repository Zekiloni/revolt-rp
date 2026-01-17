import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';

interface Step {
  n: string;
  title: string;
  desc: string;
  cta: { label: string; href: string };
}

@Component({
  selector: 'app-start-playing',
  standalone: true,
  imports: [],
  templateUrl: './start-playing.component.html',
  styleUrl: './start-playing.component.css'
})
export class StartPlayingComponent {
  ragempConnectUrl = `rage://v/connect?ip=${environment.rageServerIp}`;

  steps: Step[] = [
    {
      n: '1',
      title: 'Download RAGE MP',
      desc: 'Install the RAGE MP client for GTA V.',
      cta: { label: 'Get RAGE MP', href: '#' },
    },
    {
      n: '2',
      title: 'Create Account',
      desc: 'Register a Master Account on our UCP.',
      cta: { label: 'Open UCP', href: '#' },
    },
    {
      n: '3',
      title: 'Application Process',
      desc: 'Submit your application and create your character.',
      cta: { label: 'Start Application', href: '#' },
    },
    {
      n: '4',
      title: 'Connect & Play',
      desc: 'Join via RAGE MP and start your story.',
      cta: { label: 'Connect Now', href: this.ragempConnectUrl },
    },
  ];
}
