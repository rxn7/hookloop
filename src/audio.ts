const audioModules = import.meta.glob('@/assets/audio/*.ogg', { eager: true, import: 'default' });

export const scoreSoundMap = new Map<number, string>();
export const eventSoundMap = new Map<string, string>();

for(const [path, sound] of Object.entries(audioModules)) {
	const fileName = path.split("/").pop() || "";
	const nameWithoutExtension = fileName.replace(".ogg", "");

	const scoreNum = Number(nameWithoutExtension);
	if(!Number.isNaN(scoreNum)) {
		scoreSoundMap.set(scoreNum, sound as string);
		continue;
	}

	eventSoundMap[nameWithoutExtension] = sound as string;
}
