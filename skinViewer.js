class SkinViewer {
    constructor(container, skinUrl) {
        console.log('SkinViewer constructor called');
        this.container = container;
        this.skinUrl = skinUrl;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ alpha: true });
        this.model = null;
        this.rotation = 0;

        this.init();
    }

    init() {
        console.log('SkinViewer init called');
        try {
            this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
            this.container.appendChild(this.renderer.domElement);

            this.camera.position.z = 3;

            const light = new THREE.PointLight(0xffffff, 1, 100);
            light.position.set(0, 0, 10);
            this.scene.add(light);

            this.loadSkin();
            this.animate();
        } catch (error) {
            console.error('Error in SkinViewer init:', error);
        }
    }

    loadSkin() {
        console.log('Loading skin:', this.skinUrl);
        const loader = new THREE.TextureLoader();
        loader.load(
            this.skinUrl,
            (texture) => {
                console.log('Skin texture loaded');
                const material = new THREE.MeshBasicMaterial({ map: texture });
                const geometry = new THREE.BoxGeometry(1, 2, 1);
                this.model = new THREE.Mesh(geometry, material);
                this.scene.add(this.model);
            },
            undefined,
            (error) => {
                console.error('Error loading skin texture:', error);
            }
        );
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        if (this.model) {
            this.rotation += 0.01;
            this.model.rotation.y = Math.sin(this.rotation) * 0.5;
        }

        this.renderer.render(this.scene, this.camera);
    }
}