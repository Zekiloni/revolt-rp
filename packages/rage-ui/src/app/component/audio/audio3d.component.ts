import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Audio3dService } from './audio3d.service';
import { RageClientService } from '../../domain/service/rage-client.service';
import { ProcedureKey } from '@revolt-rp/common';


@Component({
  standalone: true,
  selector: 'app-audio-3d',
  imports: [CommonModule],
  templateUrl: './audio3d.component.html'
})
export class Audio3dComponent implements OnInit, OnDestroy {
  constructor(private rageClientService: RageClientService, private audio: Audio3dService) {
  }

  createSound = (data: [number, string, number]) => {
    const [id, url, volume] = data;
    this.audio.createSound(id, url, volume);
  };

  setVolume = (data: [number, number]) => {
    const [id, volume] = data;
    this.audio.setVolume(id, volume);
  };

  pause = (id: number) => {
    this.audio.pause(id);
  };

  resume = (id: number) => {
    this.audio.resume(id);
  };

  destroy = (id: number) => {
    this.audio.destroy(id);
  };

  setPan = (data: [number, number]) => {
    const [id, pan] = data;
    this.audio.setPan(id, pan);
  }

  ngOnInit() {
    this.rageClientService.on(ProcedureKey.BROWSER_PLAY_SOUND, this.createSound);
    this.rageClientService.on(ProcedureKey.BROWSER_SET_SOUND_VOLUME, this.setVolume);
    this.rageClientService.on(ProcedureKey.BROWSER_PAUSE_SOUND, this.pause);
    this.rageClientService.on(ProcedureKey.BROWSER_RESUME_SOUND, this.resume);
    this.rageClientService.on(ProcedureKey.BROWSER_DESTROY_SOUND, this.destroy);
    this.rageClientService.on(ProcedureKey.BROWSER_SET_SOUND_PAN, this.setPan);
  }

  ngOnDestroy() {
    this.rageClientService.off(ProcedureKey.BROWSER_PLAY_SOUND, this.createSound);
    this.rageClientService.off(ProcedureKey.BROWSER_SET_SOUND_VOLUME, this.setVolume);
    this.rageClientService.off(ProcedureKey.BROWSER_PAUSE_SOUND, this.pause);
    this.rageClientService.off(ProcedureKey.BROWSER_RESUME_SOUND, this.resume);
    this.rageClientService.off(ProcedureKey.BROWSER_DESTROY_SOUND, this.destroy);
    this.rageClientService.off(ProcedureKey.BROWSER_SET_SOUND_PAN, this.setPan);
  }
}
