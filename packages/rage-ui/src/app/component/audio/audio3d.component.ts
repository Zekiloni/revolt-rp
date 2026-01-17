import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IAudio3D, ProcedureKey } from '@revolt-rp/common';
import { RageClientService } from '../../domain/service/rage-client.service';
import { Audio3dService } from './audio3d.service';


@Component({
  standalone: true,
  selector: 'app-audio-3d',
  imports: [CommonModule],
  templateUrl: './audio3d.component.html'
})
export class Audio3dComponent implements OnInit, OnDestroy {
  constructor(private rageClientService: RageClientService, private audio: Audio3dService) {
  }

  addAudio = (audioCreate: IAudio3D) => {
    this.audio.addAudio(audioCreate);
  };

  setVolume = (data: [string, number]) => {
    const [id, volume] = data;
    this.audio.setAudioVolume(id, volume);
  };

  pause = (id: string) => {
    this.audio.pauseAudio(id);
  };

  resume = (id: string) => {
    this.audio.resumeAudio(id);
  };

  destroy = (id: string) => {
    this.audio.removeAudio(id);
  };

  setAudioMuffled = (data: [string, boolean]) => {
    const [id, muffled] = data;
    this.audio.setAudioMuffled(id, muffled);
  };

  setAudioPosition = (data: [string, number, number, number]) => {
    const [id, x, y, z] = data;
    this.audio.setAudioPosition(id, x, y, z);
  };

  setListenerPosition = (data: [number, number, number]) => {
    const [x, y, z] = data;
    this.audio.setListenerPosition(x, y, z);
  };

  setListenerOrientation = (data: [number, number, number]) => {
    const [forwardX, forwardY, forwardZ] = data;
    this.audio.setListenerOrientation(forwardX, forwardY, forwardZ);
  };

  ngOnInit() {
    this.rageClientService.on(ProcedureKey.BROWSER_ADD_AUDIO, this.addAudio);
    this.rageClientService.on(ProcedureKey.BROWSER_SET_AUDIO_VOLUME, this.setVolume);
    this.rageClientService.on(ProcedureKey.BROWSER_PAUSE_AUDIO, this.pause);
    this.rageClientService.on(ProcedureKey.BROWSER_RESUME_AUDIO, this.resume);
    this.rageClientService.on(ProcedureKey.BROWSER_DESTROY_AUDIO, this.destroy);
    this.rageClientService.on(ProcedureKey.BROWSER_SET_MUFFLED, this.setAudioMuffled);
    this.rageClientService.on(ProcedureKey.BROWSER_SET_AUDIO_POSITION, this.setAudioPosition);
    this.rageClientService.on(ProcedureKey.BROWSER_SET_LISTENER_POSITION, this.setListenerPosition);
    this.rageClientService.on(ProcedureKey.BROWSER_SET_LISTENER_ORIENTATION, this.setListenerOrientation);

  }

  ngOnDestroy() {
    this.rageClientService.off(ProcedureKey.BROWSER_ADD_AUDIO, this.addAudio);
    this.rageClientService.off(ProcedureKey.BROWSER_SET_AUDIO_VOLUME, this.setVolume);
    this.rageClientService.off(ProcedureKey.BROWSER_PAUSE_AUDIO, this.pause);
    this.rageClientService.off(ProcedureKey.BROWSER_RESUME_AUDIO, this.resume);
    this.rageClientService.off(ProcedureKey.BROWSER_DESTROY_AUDIO, this.destroy);
    this.rageClientService.off(ProcedureKey.BROWSER_SET_MUFFLED, this.setAudioMuffled);
    this.rageClientService.off(ProcedureKey.BROWSER_SET_AUDIO_POSITION, this.setAudioPosition);
    this.rageClientService.off(ProcedureKey.BROWSER_SET_LISTENER_POSITION, this.setListenerPosition);
    this.rageClientService.off(ProcedureKey.BROWSER_SET_LISTENER_ORIENTATION, this.setListenerOrientation);
  }
}
