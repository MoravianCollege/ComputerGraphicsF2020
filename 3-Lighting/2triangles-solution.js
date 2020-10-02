// Renders a 2 triangles using instancing (solution)
'use strict';

// Global WebGL context variable
let gl;


// Once the document is fully loaded run this init function.
window.addEventListener('load', function init() {
    // Get the HTML5 canvas object from it's ID
    const canvas = document.getElementById('webgl-canvas');
    if (!canvas) { window.alert('Could not find #webgl-canvas'); return; }

    // Get the WebGL context (save into a global variable)
    gl = canvas.getContext('webgl2');
    if (!gl) { window.alert("WebGL isn't available"); return; }

    // Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height); // this is the region of the canvas we want to draw on (all of it)
    gl.clearColor(1.0, 1.0, 1.0, 0.0); // setup the background color with red, green, blue, and alpha

    // Initialize the WebGL program and data
    gl.program = initProgram();
    initBuffers();

    // Render the static scene
    render();
});


/**
 * Initializes the WebGL program.
 */
function initProgram() {
    // Compile shaders
    // Vertex Shader
    let vert_shader = compileShader(gl, gl.VERTEX_SHADER,
        `#version 300 es
        precision mediump float;

        in vec4 aPosition;
        uniform vec2 uPosition;
        
        void main() {
            gl_Position.xy = aPosition.xy + uPosition.xy;
            gl_Position.zw = vec2(0, 1);
        }`
    );
    // Fragment Shader
    let frag_shader = compileShader(gl, gl.FRAGMENT_SHADER,
        `#version 300 es
        precision mediump float;

        uniform vec4 uColor;
        out vec4 fragColor;

        void main() {
            fragColor = uColor;
        }`
    );

    // Link the shaders into a program and use them with the WebGL context
    let program = linkProgram(gl, vert_shader, frag_shader);
    gl.useProgram(program);
    
    // Get the attribute indices
    program.aPosition = gl.getAttribLocation(program, 'aPosition'); // get the vertex shader attribute location for "aPosition"

    // Get the uniform indices
    program.uPosition = gl.getUniformLocation(program, 'uPosition'); // get the shader uniform location for "uPosition"
    program.uColor = gl.getUniformLocation(program, 'uColor'); // get the shader uniform location for "uColor"

    return program;
}


/**
 * Initialize the data buffers.
 */
function initBuffers() {
    // The vertices for the triangle
    let coords = [-0.4, -0.4, 0, 0.4, 0.4, -0.4];

    // Create and bind VAO
    gl.vao = gl.createVertexArray();
    gl.bindVertexArray(gl.vao);

    // Load the vertex data into the GPU and associate with shader
    let buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(coords), gl.STATIC_DRAW);
    gl.vertexAttribPointer(gl.program.aPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(gl.program.aPosition);

    // Cleanup
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
}


/**
 * Render the scene.
 */
function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.bindVertexArray(gl.vao);

    // Draw red triangle
    gl.uniform2f(gl.program.uPosition, 0.5, -0.5);
    gl.uniform4f(gl.program.uColor, 1, 0, 0, 1);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // Draw green triangle
    gl.uniform2f(gl.program.uPosition, -0.5, 0.5);
    gl.uniform4f(gl.program.uColor, 0, 1, 0, 1);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    gl.bindVertexArray(null);
}
