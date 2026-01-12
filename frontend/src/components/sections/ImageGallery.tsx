import React from 'react';





export default function ImageGallery() {
    const images = [
        {
            src: '/beautiful_Image_of_system_Eonix.png',
            alt: 'Eonix System Identity',
            title: 'Understanding Through Clarity',
            description: '"In software architecture, clarity is king. Eonix was built to transform complex codebases into comprehensible visual representations, enabling teams to understand, maintain, and evolve their systems with confidence."'
        }
    ];

    return (
        <section style={{ backgroundColor: '#ffffff', padding: '80px 0' }}>
            <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '80px',
                    alignItems: 'center'
                }}>
                    {images.map((image, index) => (
                        <div
                            key={index}
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: '40px',
                                padding: '20px',
                                flexWrap: 'wrap',
                                width: '100%',
                                justifyContent: 'center',
                                maxWidth: '1000px',
                                margin: '0 auto',
                                transition: 'opacity 0.3s ease, transform 0.3s ease'
                            }}
                            className="animate-fadeIn"
                        >
                            <div style={{
                                flex: '0 0 600px',
                                height: '350px',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                boxShadow: '0 10px 30px -15px rgba(0, 0, 0, 0.1)',
                                border: '1px solid #f0f0f0',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                            }}>
                                <img
                                    src={image.src}
                                    alt={image.alt}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        display: 'block',
                                        transition: 'transform 0.3s ease'
                                    }}
                                    className="optimized-img"
                                />
                            </div>
                            <div style={{
                                flex: '0 0 600px',
                                padding: '20px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center'
                            }}>
                                <h3 style={{
                                    fontSize: '26px',
                                    fontWeight: 700,
                                    color: '#1a1a1a',
                                    marginBottom: '16px',
                                    lineHeight: 1.4
                                }}>
                                    {image.title}
                                </h3>
                                <p style={{
                                    fontSize: '17px',
                                    color: '#1a1a1a',
                                    lineHeight: 1.7,
                                    marginBottom: 0
                                }}>
                                    {image.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}