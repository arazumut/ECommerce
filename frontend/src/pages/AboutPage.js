import React from 'react';
import { Container, Row, Col, Card, Image } from 'react-bootstrap';
import { FaCheckCircle, FaTrophy, FaUsers, FaStore } from 'react-icons/fa';
import './AboutPage.css';

const AboutPage = () => {
  // Ekip üyeleri
  const teamMembers = [
    {
      id: 1,
      name: 'Ahmet Yılmaz',
      title: 'CEO & Kurucu',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=300&q=80',
      bio: '10 yılı aşkın e-ticaret deneyimi ile şirketimizi sektörde lider konuma getirmek için çalışıyor.'
    },
    {
      id: 2,
      name: 'Ayşe Demir',
      title: 'Pazarlama Direktörü',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=300&q=80',
      bio: 'Dijital pazarlama stratejileri ile markamızı büyütme konusunda uzman. Müşteri odaklı yaklaşımı ile tanınıyor.'
    },
    {
      id: 3,
      name: 'Mehmet Kaya',
      title: 'Ürün Müdürü',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=300&q=80',
      bio: 'Ürün portföyümüzün genişletilmesi ve kalite standartlarının belirlenmesinden sorumlu.'
    },
    {
      id: 4,
      name: 'Zeynep Koç',
      title: 'Müşteri Deneyimi Lideri',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=300&q=80',
      bio: 'Müşteri memnuniyetini en üst seviyede tutmak için süreçleri sürekli iyileştiriyor.'
    }
  ];

  // Şirket değerleri
  const values = [
    {
      id: 1,
      title: 'Müşteri Odaklılık',
      icon: <FaUsers />,
      description: 'Müşterilerimizin ihtiyaçlarını anlamak ve onları memnun etmek öncelikli hedefimizdir.'
    },
    {
      id: 2,
      title: 'Kalite',
      icon: <FaCheckCircle />,
      description: 'En yüksek kalitede ürünleri sunmak için sürekli çalışıyoruz.'
    },
    {
      id: 3,
      title: 'Yenilik',
      icon: <FaTrophy />,
      description: 'E-ticaret sektöründe yenilikçi çözümler sunmak için kendimizi sürekli geliştiriyoruz.'
    },
    {
      id: 4,
      title: 'Güvenilirlik',
      icon: <FaStore />,
      description: 'Müşterilerimize güven veren, şeffaf ve dürüst bir alışveriş deneyimi sunuyoruz.'
    }
  ];

  // Tarihçe zaman çizelgesi
  const timeline = [
    {
      year: '2015',
      title: 'Şirketin Kuruluşu',
      description: 'Küçük bir ofiste büyük hayallerle yolculuğumuza başladık.'
    },
    {
      year: '2017',
      title: 'İlk 10.000 Müşteri',
      description: 'Müşteri portföyümüz hızla büyüdü ve 10.000 sadık müşteriye ulaştık.'
    },
    {
      year: '2019',
      title: 'Yeni Merkez Ofis',
      description: 'Büyüyen ekibimiz için daha geniş ve modern bir merkez ofise taşındık.'
    },
    {
      year: '2021',
      title: 'Uluslararası Pazara Açılış',
      description: 'Ürünlerimizi yurtdışına ihraç etmeye başladık ve global pazarda yerimizi aldık.'
    },
    {
      year: '2023',
      title: 'E-Ticaret Ödülü',
      description: 'Müşteri memnuniyeti kategorisinde yılın e-ticaret sitesi ödülünü kazandık.'
    }
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero-section">
        <div className="about-hero-overlay">
          <Container>
            <Row className="justify-content-center">
              <Col md={8} className="text-center">
                <h1>Hakkımızda</h1>
                <p className="lead">
                  Müşterilerimize en iyi alışveriş deneyimini sunmak için 2015 yılından beri hizmet veriyoruz.
                </p>
              </Col>
            </Row>
          </Container>
        </div>
      </section>

      {/* Story Section */}
      <section className="story-section">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <div className="about-image">
                <Image 
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80" 
                  alt="Şirket Ofisi" 
                  fluid 
                  className="rounded shadow-lg" 
                />
              </div>
            </Col>
            <Col lg={6}>
              <div className="story-content">
                <h2>Hikayemiz</h2>
                <p>
                  2015 yılında, e-ticaret sektöründe yenilikçi ve müşteri odaklı bir yaklaşım sunmak amacıyla kurulduk. O günden bu yana, sektördeki standartları yükseltmek ve alışveriş deneyimini dönüştürmek için çalışıyoruz.
                </p>
                <p>
                  Misyonumuz, müşterilerimize yüksek kaliteli ürünleri uygun fiyatlarla sunarak, güvenilir ve keyifli bir alışveriş deneyimi yaşatmaktır. Vizyonumuz ise, Türkiye'nin en sevilen ve en çok tercih edilen e-ticaret markası olmaktır.
                </p>
                <p>
                  Bugün, 50'den fazla çalışanımız, binlerce ürün çeşidimiz ve Türkiye'nin dört bir yanından yüz binlerce müşterimiz ile büyümeye devam ediyoruz. Her zaman daha iyisini sunmak için kendimizi sürekli geliştiriyor ve yeniliyoruz.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <Container>
          <div className="section-title text-center mb-5">
            <h2>Değerlerimiz</h2>
            <p>Bizi biz yapan temel değerler</p>
          </div>
          <Row className="g-4">
            {values.map(value => (
              <Col md={3} sm={6} key={value.id}>
                <Card className="value-card h-100">
                  <Card.Body className="text-center">
                    <div className="value-icon">
                      {value.icon}
                    </div>
                    <Card.Title>{value.title}</Card.Title>
                    <Card.Text>{value.description}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Timeline Section */}
      <section className="timeline-section">
        <Container>
          <div className="section-title text-center mb-5">
            <h2>Yolculuğumuz</h2>
            <p>Kuruluşumuzdan bugüne önemli dönüm noktalarımız</p>
          </div>
          <div className="timeline">
            {timeline.map((item, index) => (
              <div className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`} key={index}>
                <div className="timeline-badge">{item.year}</div>
                <div className="timeline-panel">
                  <div className="timeline-heading">
                    <h4>{item.title}</h4>
                  </div>
                  <div className="timeline-body">
                    <p>{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <Container>
          <div className="section-title text-center mb-5">
            <h2>Ekibimiz</h2>
            <p>Başarımızın arkasındaki uzman ekip</p>
          </div>
          <Row className="g-4">
            {teamMembers.map(member => (
              <Col lg={3} md={6} key={member.id}>
                <Card className="team-card h-100">
                  <div className="team-member-image">
                    <Card.Img variant="top" src={member.image} alt={member.name} />
                  </div>
                  <Card.Body className="text-center">
                    <Card.Title>{member.name}</Card.Title>
                    <div className="member-title">{member.title}</div>
                    <Card.Text>{member.bio}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <Container>
          <Row className="text-center">
            <Col md={3} sm={6}>
              <div className="stat-item">
                <div className="stat-number">8+</div>
                <div className="stat-text">Yıllık Deneyim</div>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className="stat-item">
                <div className="stat-number">200K+</div>
                <div className="stat-text">Mutlu Müşteri</div>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className="stat-item">
                <div className="stat-number">10K+</div>
                <div className="stat-text">Ürün Çeşidi</div>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className="stat-item">
                <div className="stat-number">81</div>
                <div className="stat-text">İl Kapsama Alanı</div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default AboutPage; 