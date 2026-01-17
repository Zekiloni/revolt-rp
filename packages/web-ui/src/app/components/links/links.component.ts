import { Component } from '@angular/core';

interface LinkItem {
  id: string;
  title: string;
  desc: string;
  cta: { label: string; href: string };
}

@Component({
  selector: 'app-links',
  standalone: true,
  imports: [],
  templateUrl: './links.component.html',
  styleUrl: './links.component.css'
})
export class LinksComponent {

  links: LinkItem[] = [
    {
      id: 'F',
      title: 'Community Forum',
      desc: 'Discuss, share guides and connect with the community.',
      cta: { label: 'Visit Forum', href: '' }
    },
    {
      id: 'W',
      title: 'Wiki',
      desc: 'Learn rules, systems, and tips to start strong.',
      cta: { label: 'View Wiki', href: '' }
    }
  ];
}
