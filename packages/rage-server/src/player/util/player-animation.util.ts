import { AnimationFlag, IPlayerAnimation, PlayerSharedDataType } from '@revolt-rp/common';


export function playAnimation(
	player: PlayerMp,
   dict: string,
   name: string,
   flag: AnimationFlag = AnimationFlag.CANCELABLE,
   duration = -1
) {
	const animation: IPlayerAnimation = {
		dictionary: dict,
		name: name,
		flag: flag,
		duration: duration
	};

	player.setVariable(PlayerSharedDataType.Animation, animation);
}

export function stopAnimation(player: PlayerMp) {
	player.setVariable(PlayerSharedDataType.Animation, null);
	player.stopAnimation();
}




