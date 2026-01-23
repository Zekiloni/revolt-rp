import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Audio3dService, AudioSpot } from '../../audio/audio3d.service';
import { RageClientService } from '../../../domain/service/rage-client.service';
import { ProcedureKey } from '@revolt-rp/common';

@Component({
  selector: 'app-speaker',
  standalone: true,
  providers: [Audio3dService],
  imports: [CommonModule],
  templateUrl: './speaker.component.html',
  styleUrl: './speaker.component.css',
})
export class SpeakerComponent implements OnInit, OnDestroy {
  private rageClientService = inject(RageClientService);
  private audio3dService = inject(Audio3dService);
  audioSpit: AudioSpot | null = null;

  setAudio = (audioId: string) => {
    this.audioSpit = this.audio3dService.getAudioSpot(audioId) || null;
  }

  ngOnInit() {
    this.rageClientService.on(ProcedureKey.BROWSER_SET_SPEAKER_AUDIO, this.setAudio)
  }

  ngOnDestroy() {
    this.rageClientService.off(ProcedureKey.BROWSER_SET_SPEAKER_AUDIO, this.setAudio)
  }
}
