class PoseDetector {
    constructor() {
        this.video = null;
        this.canvas = null;
        this.ctx = null;
        this.pose = null;
        this.camera = null;
        this.isTracking = false;
        this.onPoseUpdate = null;
        this.lastPoseData = null;
        
        // Check if MediaPipe libraries are available
        this.mediaPipeAvailable = false;
        this.checkMediaPipeAvailability();
    }
    
    checkMediaPipeAvailability() {
        // Check immediately
        this.updateMediaPipeStatus();
        
        // Check again after a delay
        setTimeout(() => {
            this.updateMediaPipeStatus();
        }, 1000);
        
        // Check again after 3 seconds
        setTimeout(() => {
            this.updateMediaPipeStatus();
        }, 3000);
    }
    
    updateMediaPipeStatus() {
        // Check if MediaPipe libraries are available
        const poseAvailable = typeof Pose !== 'undefined';
        const cameraAvailable = typeof Camera !== 'undefined';
        // The drawing helpers are exposed as standalone global functions, not a namespace
        const drawingUtilsAvailable =
            typeof drawConnectors === 'function' && typeof drawLandmarks === 'function';
        
        this.mediaPipeAvailable = poseAvailable && cameraAvailable && drawingUtilsAvailable;
        
        console.log('MediaPipe Status Check:');
        console.log('- Pose available:', poseAvailable);
        console.log('- Camera available:', cameraAvailable);
        console.log('- drawConnectors available:', typeof drawConnectors !== 'undefined');
        console.log('- drawLandmarks available:', typeof drawLandmarks !== 'undefined');
        console.log('- Overall available:', this.mediaPipeAvailable);
        
        if (!this.mediaPipeAvailable) {
            console.warn('MediaPipe libraries not available. Using fallback mode.');
            this.updateStatus('MediaPipe not available - using fallback mode', 'warning');
        } else {
            console.log('✅ MediaPipe libraries are available');
            this.updateStatus('MediaPipe libraries loaded successfully', 'success');
        }
    }
    
    async initialize(videoElement, canvasElement) {
        this.video = videoElement;
        this.canvas = canvasElement;
        this.ctx = this.canvas.getContext('2d');
        
        // Check MediaPipe availability again before initializing
        this.updateMediaPipeStatus();
        
        if (!this.mediaPipeAvailable) {
            this.updateStatus('MediaPipe libraries not loaded. Please refresh the page and try again.', 'error');
            console.error('Cannot initialize pose detection - MediaPipe not available');
            return false;
        }
        
        try {
            console.log('Initializing MediaPipe Pose...');
            
            // Initialize MediaPipe Pose
            this.pose = new Pose({
                locateFile: (file) => {
                    return `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1675469404/${file}`;
                }
            });
            
            this.pose.setOptions({
                modelComplexity: 1,
                smoothLandmarks: true,
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5
            });
            
            this.pose.onResults((results) => {
                this.onPoseResults(results);
            });
            
            this.updateStatus('Pose detection initialized successfully', 'success');
            console.log('✅ Pose detection initialized successfully');
            return true;
            
        } catch (error) {
            console.error('Error initializing pose detection:', error);
            this.updateStatus('Failed to initialize pose detection: ' + error.message, 'error');
            return false;
        }
    }
    
    async startTracking() {
        console.log('Starting tracking...');
        console.log('MediaPipe available:', this.mediaPipeAvailable);
        console.log('Pose object:', this.pose);
        
        if (!this.mediaPipeAvailable) {
            this.updateStatus('MediaPipe not available - cannot start tracking', 'error');
            console.error('Cannot start tracking - MediaPipe not available');
            return false;
        }
        
        if (!this.pose) {
            this.updateStatus('Pose detection not initialized', 'error');
            console.error('Cannot start tracking - Pose not initialized');
            return false;
        }
        
        try {
            console.log('Initializing camera...');
            
            // Initialize camera
            this.camera = new Camera(this.video, {
                onFrame: async () => {
                    if (this.isTracking) {
                        await this.pose.send({image: this.video});
                    }
                },
                width: 640,
                height: 480
            });
            
            await this.camera.start();
            this.isTracking = true;
            this.updateStatus('Body tracking started successfully', 'success');
            console.log('✅ Body tracking started successfully');
            return true;
            
        } catch (error) {
            console.error('Error starting tracking:', error);
            this.updateStatus('Failed to start tracking: ' + error.message, 'error');
            return false;
        }
    }
    
    stopTracking() {
        this.isTracking = false;
        if (this.camera) {
            this.camera.stop();
        }
        this.updateStatus('Body tracking stopped', 'info');
    }
    
    onPoseResults(results) {
        if (!results.poseLandmarks) {
            this.updateStatus('No pose detected - make sure your full body is visible', 'warning');
            return;
        }
        
        const landmarks = results.poseLandmarks;
        this.lastPoseData = this.processPoseData(landmarks);
        
        // Draw pose skeleton
        this.drawPoseSkeleton(results);
        
        // Update confidence
        const avgConfidence = landmarks.reduce((sum, landmark) => sum + landmark.visibility, 0) / landmarks.length;
        this.updateConfidence(avgConfidence * 100);
        
        // Call callback if provided
        if (this.onPoseUpdate) {
            this.onPoseUpdate(this.lastPoseData);
        }
        
        this.updateStatus('Pose detected - controlling character', 'success');
    }
    
    processPoseData(landmarks) {
        // Extract key pose data for game control
        const nose = landmarks[0];
        const leftShoulder = landmarks[11];
        const rightShoulder = landmarks[12];
        const leftHip = landmarks[23];
        const rightHip = landmarks[24];
        const leftKnee = landmarks[25];
        const rightKnee = landmarks[26];
        const leftAnkle = landmarks[27];
        const rightAnkle = landmarks[28];
        const leftWrist = landmarks[15];
        const rightWrist = landmarks[16];
        
        // Calculate body position and movements
        const bodyCenter = {
            x: (leftShoulder.x + rightShoulder.x) / 2,
            y: (leftShoulder.y + rightShoulder.y) / 2
        };
        
        const hipCenter = {
            x: (leftHip.x + rightHip.x) / 2,
            y: (leftHip.y + rightHip.y) / 2
        };
        
        // Detect jumping (arms raised or body elevated)
        const armsRaised = (leftWrist.y < leftShoulder.y && rightWrist.y < rightShoulder.y);
        const bodyElevated = bodyCenter.y < 0.4; // Body is in upper part of frame
        const isJumping = armsRaised || bodyElevated;
        
        // Detect left/right movement (body leaning)
        const bodyLean = bodyCenter.x - 0.5; // -0.5 to 0.5 range
        const isMovingLeft = bodyLean < -0.1;
        const isMovingRight = bodyLean > 0.1;
        
        // Detect ducking (body lowered)
        const bodyHeight = Math.abs(bodyCenter.y - hipCenter.y);
        const isDucking = bodyHeight < 0.15 || bodyCenter.y > 0.7;
        
        return {
            isJumping,
            isMovingLeft,
            isMovingRight,
            isDucking,
            bodyCenter,
            confidence: nose.visibility,
            rawLandmarks: landmarks
        };
    }
    
    drawPoseSkeleton(results) {
        if (!this.ctx || !results.poseLandmarks) return;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Use the global helper functions provided by @mediapipe/drawing_utils
        drawConnectors(
            this.ctx,
            results.poseLandmarks,
            POSE_CONNECTIONS,
            { color: '#00FF00', lineWidth: 2 }
        );
        drawLandmarks(
            this.ctx,
            results.poseLandmarks,
            { color: '#FF0000', lineWidth: 1, radius: 3 }
        );
    }
    
    updateStatus(message, type = 'info') {
        const statusElement = document.getElementById('pose-status');
        if (statusElement) {
            statusElement.textContent = message;
            statusElement.className = `status-${type}`;
        }
        
        // Also update modal status if available
        const modalStatus = document.getElementById('modal-status-text');
        if (modalStatus) {
            modalStatus.textContent = message;
        }
    }
    
    updateConfidence(confidence) {
        const confidenceElement = document.getElementById('pose-confidence');
        if (confidenceElement) {
            confidenceElement.textContent = `Confidence: ${confidence.toFixed(1)}%`;
        }
    }
    
    getLastPoseData() {
        return this.lastPoseData;
    }
    
    // Fallback method for when MediaPipe is not available
    simulatePoseData() {
        if (!this.mediaPipeAvailable) {
            // Return simulated pose data for testing
            return {
                isJumping: false,
                isMovingLeft: false,
                isMovingRight: false,
                isDucking: false,
                bodyCenter: { x: 0.5, y: 0.5 },
                confidence: 0.8,
                rawLandmarks: []
            };
        }
        return this.lastPoseData;
    }
} 