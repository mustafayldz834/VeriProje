'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLocalStorage } from '@mantine/hooks'
import Link from 'next/link'
import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Stack,
  SimpleGrid,
  Card,
  ThemeIcon,
  Paper,
  Avatar,
  Badge,
  Box,
  BackgroundImage,
  Overlay,
  Center,
  Grid,
  List,
  Divider,
} from '@mantine/core'
import {
  IconCalendar,
  IconUser,
  IconHeart,
  IconShield,
  IconClock,
  IconPhone,
  IconMail,
  IconMapPin,
  IconStar,
  IconCheck,
  IconArrowRight,
  IconUsers,
  IconBrain,
  IconActivity,
} from '@tabler/icons-react'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'

export default function Home() {
  const router = useRouter()
  const [user] = useLocalStorage({ key: 'user', defaultValue: null })

  const stats = [
    { label: 'Memnun Hasta', value: '500+', icon: IconUsers },
    { label: 'Başarı Oranı', value: '%95', icon: IconCheck },
    { label: 'Deneyim', value: '10+ Yıl', icon: IconStar },
    { label: 'Uzman Terapist', value: '15+', icon: IconBrain }
  ]

  const testimonials = [
    {
      name: 'MUSTAFA YILDIZ',
      role: 'Hasta',
      content: 'Terapi sürecimde kendimi güvende hissettim. Ağrılarımdan kurtulup, yaşam kalitemi artırdım.',
      rating: 5
    },
    {
      name: 'SAFİYE ALACA',
      role: 'Hasta',
      content: 'Profesyonel yaklaşım ve özel tedavi planı sayesinde sorunlarımı çözdüm.',
      rating: 5
    },
    {
      name: 'FURKAN FEDAKER',
      role: 'Hasta',
      content: 'Her seans sonrası kendimi daha iyi hissediyorum. Kesinlikle tavsiye ederim.',
      rating: 5
    }
  ]

  const handleGetStarted = () => {
    router.push('/appointments')
  }

  return (
    <Box>
      <Header user={user} setUser={() => {}} />
      {/* Hero Section */}
      <BackgroundImage
        src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        radius="md"
        h={600}
      >
        <Overlay 
          gradient="linear-gradient(45deg, rgba(245,245,220,0.2) 0%, rgba(245,245,220,0.1) 50%, rgba(245,245,220,0.3) 100%)" 
          opacity={0.2} 
        />
        <Container size="lg" h="100%">
          <Center h="100%">
            <Stack align="center" gap="xl">
              <Title order={1} size="3.5rem" c="white" ta="center" fw={900} lh={1.1} style={{ 
                fontWeight: '900',
                textRendering: 'optimizeLegibility',
                WebkitTextFillColor: '#ffffff',
                WebkitTextStroke: '0.5px #ffffff'
              }}>
                Vücudunuzun Potansiyelini Keşfedin!
              </Title>
              <Text size="1.5rem" c="white" ta="center" maw={700} lh={1.7} fw={700} style={{ 
                fontWeight: '700',
                textRendering: 'optimizeLegibility',
                WebkitTextFillColor: '#ffffff',
                WebkitTextStroke: '0.5px #ffffff'
              }}>
                Postür, denge ve hareket fonksiyonlarınızı geliştirerek daha sağlıklı bir bedene kavuşmanızı sağlıyoruz.
              </Text>
            </Stack>
          </Center>
        </Container>
      </BackgroundImage>

      {/* Stats Section */}
      <Container size="lg" py={80}>
        <SimpleGrid cols={{ base: 2, md: 4 }} spacing="xl">
          {stats.map((stat, index) => (
            <Paper key={index} p="xl" withBorder ta="center">
              <ThemeIcon size={60} radius="xl" variant="light" color="blue" mx="auto" mb="md">
                <stat.icon size={30} />
              </ThemeIcon>
              <Text size="2.5rem" fw={900} c="blue" lh={1.2} style={{
                fontWeight: '900',
                textRendering: 'optimizeLegibility',
                WebkitTextFillColor: '#228be6',
                WebkitTextStroke: '0.5px #228be6'
              }}>
                {stat.value}
              </Text>
              <Text size="md" fw={700} lh={1.4} style={{
                fontWeight: '700',
                textRendering: 'optimizeLegibility',
                color: '#F5F5DC',
                WebkitTextFillColor: '#F5F5DC',
                WebkitTextStroke: '0.5px #F5F5DC'
              }}>
                {stat.label}
              </Text>
            </Paper>
          ))}
        </SimpleGrid>
      </Container>


      {/* About Section */}
      <Container size="lg" py={80}>
        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Stack gap="xl">
              <Title order={2} fw={900} lh={1.2} size="2.25rem" style={{
                fontWeight: '900',
                textRendering: 'optimizeLegibility',
                color: '#F5F5DC',
                WebkitTextFillColor: '#F5F5DC',
                WebkitTextStroke: '0.5px #F5F5DC'
              }}>
                Ben Kimim?
              </Title>
              <Text size="xl" lh={1.7} fw={700} style={{
                fontWeight: '700',
                textRendering: 'optimizeLegibility',
                color: '#F5F5DC',
                WebkitTextFillColor: '#F5F5DC',
                WebkitTextStroke: '0.5px #F5F5DC'
              }}>
                Merhaba, ben uzman terapist ekibimiz. Fiziksel sağlık ve iyilik halinizi geliştirmek için yıllardır özveriyle çalışıyoruz.
              </Text>
              <List spacing="md" size="md" fw={700} style={{
                fontWeight: '700',
                textRendering: 'optimizeLegibility',
                color: '#F5F5DC',
                WebkitTextFillColor: '#F5F5DC',
                WebkitTextStroke: '0.5px #F5F5DC'
              }}>
                <List.Item icon={<IconCheck size={18} />}>Hareket Kabiliyetiniz Artsın</List.Item>
                <List.Item icon={<IconCheck size={18} />}>Postür Ve Duruş Bozukluklarınız Düzelsin</List.Item>
                <List.Item icon={<IconCheck size={18} />}>Kas Gücünüz ve Esnekliğiniz Artsın</List.Item>
                <List.Item icon={<IconCheck size={18} />}>Kronik Ağrılarınız Yok Olsun</List.Item>
                <List.Item icon={<IconCheck size={18} />}>Yaşam Kaliteniz Yükselsin</List.Item>
              </List>
            </Stack>
          </Grid.Col>
          
        </Grid>
      </Container>

      {/* Testimonials Section */}
      <Box bg="#7a6b5f" py={80}>
        <Container size="lg">
          <Stack align="center" gap="xl" mb={60}>
            <Title order={2} ta="center" fw={900} lh={1.2} size="2.25rem" style={{
              fontWeight: '900',
              textRendering: 'optimizeLegibility',
              color: '#F5F5DC',
              WebkitTextFillColor: '#F5F5DC',
              WebkitTextStroke: '0.5px #F5F5DC'
            }}>
              Hastalarımızdan Yorumlar
            </Title>
            <Text size="xl" ta="center" fw={700} lh={1.6} style={{
              fontWeight: '700',
              textRendering: 'optimizeLegibility',
              color: '#F5F5DC',
              WebkitTextFillColor: '#F5F5DC',
              WebkitTextStroke: '0.5px #F5F5DC'
            }}>
              Memnun hastalarımızın deneyimleri
            </Text>
          </Stack>

          <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl">
            {testimonials.map((testimonial, index) => (
              <Card key={index} shadow="sm" padding="xl" radius="md" withBorder>
                <Stack gap="md">
                  <Group>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <IconStar key={i} size={16} fill="gold" color="gold" />
                    ))}
                  </Group>
                  <Text size="md" fw={700} lh={1.6} style={{
                    fontWeight: '700',
                    textRendering: 'optimizeLegibility',
                    color: '#000000',
                    WebkitTextFillColor: '#000000',
                    WebkitTextStroke: '0.5px #000000'
                  }}>
                    "{testimonial.content}"
                  </Text>
                  <Divider />
                  <Group>
                    <Avatar size="md" radius="xl" color="blue">
                      {testimonial.name[0]}
                    </Avatar>
                    <div>
                      <Text fw={900} size="md" style={{
                        fontWeight: '900',
                        textRendering: 'optimizeLegibility',
                        color: '#000000',
                        WebkitTextFillColor: '#000000',
                        WebkitTextStroke: '0.5px #000000'
                      }}>{testimonial.name}</Text>
                      <Text size="md" fw={700} style={{
                        fontWeight: '700',
                        textRendering: 'optimizeLegibility',
                        color: '#000000',
                        WebkitTextFillColor: '#000000',
                        WebkitTextStroke: '0.5px #000000'
                      }}>{testimonial.role}</Text>
                    </div>
                  </Group>
                </Stack>
              </Card>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container size="lg" py={80}>
        <Paper 
          p="xl" 
          radius="md" 
          withBorder
          style={{
            background: '#7a6b5f',
            border: '2px solid #dee2e6',
            boxShadow: '0 4px 12px rgba(245,245,220,0.1)'
          }}
        >
          <Stack align="center" gap="xl">
            <Title 
              order={2} 
              ta="center" 
              fw={900} 
              lh={1.1} 
              size="2.5rem"
              style={{
                letterSpacing: '-0.02em',
                color: '#F5F5DC',
                fontWeight: '900',
                textRendering: 'optimizeLegibility'
              }}
            >
              Ağrılarınızla daha fazla zaman geçirmeyin!
            </Title>
            <Text 
              size="1.25rem" 
              ta="center" 
              maw={800} 
              fw={700} 
              lh={1.6}
              style={{
                letterSpacing: '0.01em',
                color: '#F5F5DC',
                fontWeight: '700',
                textRendering: 'optimizeLegibility',
                WebkitTextFillColor: '#F5F5DC',
                WebkitTextStroke: '0.5px #F5F5DC'
              }}
            >
              Ücretsiz ön görüşme için randevu alın sizin için neler yapabileceğimizi konuşalım.
            </Text>
            <Group gap="md">
              <Button 
                size="xl" 
                variant="outline" 
                component={Link} 
                href="/contact"
                style={{
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  padding: '16px 32px',
                  borderWidth: '2px',
                  boxShadow: '0 2px 8px rgba(245,245,220,0.1)'
                }}
              >
                İletişime Geç
              </Button>
            </Group>
          </Stack>
        </Paper>
      </Container>
      
      <Footer />
    </Box>
  )
}
