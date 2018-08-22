requestAnimationFrame((function loop(then) {
    return now => {
        const delta = now - then;
        return requestAnimationFrame(loop(now));
    }
})(Performance.now()));