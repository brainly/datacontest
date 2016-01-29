export default function changeBackgroundColor(index) {
    const colors = [
        '#6ed6a0',
        '#5bb8ff',
        '#ff8073',
        '#ffbe32'
    ];

    const rand = Math.floor(Math.random() * colors.length);

    if (index != 0) {
        document.body.style.backgroundColor = colors[rand];
    } else {
        document.body.style.backgroundColor = '';
    }
}
