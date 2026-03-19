<script lang="ts">
import { onDestroy, onMount } from "svelte";

type Props = {
	lines?: string | string[];
	typeSpeed?: number;
	deleteSpeed?: number;
	waitTime?: number;
};

let {
	lines = [],
	typeSpeed = 100,
	deleteSpeed = 50,
	waitTime = 2000,
}: Props = $props();

let currentLineIndex = 0;
let currentCharIndex = 0;
let currentText = $state("");
let isDeleting = false;
let cursorVisible = $state(true);
let timer: ReturnType<typeof setTimeout> | undefined;
let cursorInterval: ReturnType<typeof setInterval> | undefined;

let textLines = $derived(Array.isArray(lines) ? lines : [lines]);

function type() {
	if (!textLines.length) return;

	const fullText = textLines[currentLineIndex];

	if (isDeleting) {
		currentText = fullText.substring(0, currentCharIndex - 1);
		currentCharIndex--;
	} else {
		currentText = fullText.substring(0, currentCharIndex + 1);
		currentCharIndex++;
	}

	let typeSpeedCurrent = typeSpeed;

	if (isDeleting) {
		typeSpeedCurrent = deleteSpeed;
	}

	if (!isDeleting && currentText === fullText) {
		typeSpeedCurrent = waitTime;
		isDeleting = true;
	} else if (isDeleting && currentText === "") {
		isDeleting = false;
		currentLineIndex = (currentLineIndex + 1) % textLines.length;
		typeSpeedCurrent = 500;
	}

	timer = setTimeout(type, typeSpeedCurrent);
}

onMount(() => {
	if (textLines.length > 0) {
		timer = setTimeout(type, 1000);
	}

	cursorInterval = setInterval(() => {
		cursorVisible = !cursorVisible;
	}, 530);
});

onDestroy(() => {
	clearTimeout(timer);
	clearInterval(cursorInterval);
});
</script>

<div
  class="typewriter-container inline-flex items-center text-neutral-400 min-h-[1.5rem] whitespace-nowrap"
>
  <span>{currentText}</span>
  <span class="cursor ml-[1px]" style:opacity={cursorVisible ? 1 : 0}>|</span>
</div>

<style>
  .cursor {
    color: var(--primary);
    transition: opacity 0.1s;
    line-height: 1;
  }
</style>
