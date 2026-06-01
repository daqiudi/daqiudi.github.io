/**
 * 粒子系统
 * 负责场景中的花瓣、星光、光斑等动态粒子效果
 */

class ParticleSystem {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.particles = [];
        this.intensity = 0.7; // 粒子强度 (0-1)
        
        this.init();
    }
    
    /**
     * 初始化粒子系统
     */
    init() {
        // 创建默认粒子效果（柔和星光）
        this.createDefaultParticles();
    }
    
    /**
     * 创建默认粒子效果
     */
    createDefaultParticles() {
        // 清除现有粒子
        this.clearParticles();
        
        // 创建柔和的星光粒子
        const particleCount = Math.floor(80 * this.intensity);
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        
        for (let i = 0; i < particleCount; i++) {
            positions.push(
                Math.random() * 40 - 20,
                Math.random() * 30,
                Math.random() * 40 - 20
            );
        }
        
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        
        const material = new THREE.PointsMaterial({
            color: 0xffd700,
            size: 0.25,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });
        
        const particleSystem = new THREE.Points(geometry, material);
        particleSystem.userData = { type: 'sparkle' };
        
        this.sceneManager.getScene().add(particleSystem);
        this.particles.push(particleSystem);
    }
    

    /**
     * 设置粒子强度
     */
    setIntensity(value) {
        this.intensity = value / 100;
        this.createDefaultParticles(); // 重新创建粒子
    }
    
    /**
     * 更新粒子动画
     */
    update() {
        this.particles.forEach(particle => {
            const positions = particle.geometry.attributes.position.array;
            const velocities = particle.userData.velocities;
            
            if (velocities) {
                // 有速度的粒子
                for (let i = 0; i < positions.length; i += 3) {
                    positions[i] += velocities[i];
                    positions[i + 1] += velocities[i + 1];
                    positions[i + 2] += velocities[i + 2];
                    
                    // 边界检测和重置
                    if (positions[i + 1] < -5) {
                        positions[i] = Math.random() * 40 - 20;
                        positions[i + 1] = 25;
                        positions[i + 2] = Math.random() * 40 - 20;
                    }
                }
            } else if (particle.userData.type === 'sparkle') {
                // 星光闪烁效果
                particle.material.opacity = 0.5 + Math.sin(Date.now() * 0.003) * 0.4;
            }
            
            particle.geometry.attributes.position.needsUpdate = true;
        });
    }
    
    /**
     * 清除所有粒子
     */
    clearParticles() {
        this.particles.forEach(particle => {
            this.sceneManager.getScene().remove(particle);
            particle.geometry.dispose();
            particle.material.dispose();
        });
        this.particles = [];
    }
}

// 导出粒子系统
window.ParticleSystem = ParticleSystem;
