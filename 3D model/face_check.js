const { GLTFLoader } = require('node-three-gltf');
const loader = new GLTFLoader();

loader.load("./YOUR_PATH/MODEL.gltf", (gltf) => {

    const model = gltf.scene;

    let vertices = 0, faces = 0;
    for (let i = 0, l = model.children.length; i < l; i++) {
        const object = model.children[i];

        object.traverseVisible(function (object) {

            if (object.isMesh) {
                const geometry = object.geometry;
                vertices += geometry.attributes.position.count;

                if (geometry.index !== null) {
                    
                    faces += geometry.index.count / 3;
                } else {
                    
                    faces += geometry.attributes.position.count / 3;
                }
            }
        });
    }
    console.log(`Vertices: ${vertices}, Faces: ${faces}`)
});