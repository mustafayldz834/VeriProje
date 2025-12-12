'use client'

import {
  Container,
  Title,
  Text,
  Grid,
  Card,
  Stack,
  ThemeIcon,
  Group,
  Button,
  Box,
  Paper,
  List,
  Avatar,
  SimpleGrid,
  Badge,
} from '@mantine/core'
import {
  IconUser,
  IconAward,
  IconGraduationCap,
  IconHeart,
  IconShield,
  IconCheck,
  IconStar,
  IconCalendar,
  IconPhone,
  IconMail,
} from '@tabler/icons-react'
import Link from 'next/link'
import { Header } from '../../components/Header'
import { Footer } from '../../components/Footer'
import { useLocalStorage } from '@mantine/hooks'

export default function About() {
  const [user] = useLocalStorage({ key: 'user', defaultValue: null })
  const achievements = [
    {
      title: '10+ Yıl Deneyim',
      description: 'Fiziksel sağlık alanında uzun yıllar deneyim',
      icon: IconAward,
      color: 'blue'
    },
    {
      title: '500+ Memnun Hasta',
      description: 'Başarılı tedavi süreçleri',
      icon: IconHeart,
      color: 'red'
    },
    {
      title: 'Uzman Sertifikalar',
      description: 'Uluslararası sertifikalı uzmanlık',
      icon: IconGraduationCap,
      color: 'green'
    },
    {
      title: '%95 Başarı Oranı',
      description: 'Yüksek tedavi başarı oranı',
      icon: IconShield,
      color: 'teal'
    }
  ]

  const specializations = [
    'Manuel Terapi',
    'Kayropraktik',
    'Skolyoz Tedavisi',
    'Lenfödem',
    'Postür Düzeltme',
    'Ağrı Yönetimi',
    'Hareket Terapisi',
    'Rehabilitasyon'
  ]

  const values = [
    {
      title: 'Holistic Yaklaşım',
      description: 'Fiziksel sağlığınızın yanı sıra mental ve duygusal sağlığınızı da önemsiyoruz.',
      icon: IconHeart
    },
    {
      title: 'Kişiye Özel Tedavi',
      description: 'Her bireyin benzersiz olduğunu biliyoruz ve size özel tedavi planları oluşturuyoruz.',
      icon: IconUser
    },
    {
      title: 'Modern Teknikler',
      description: 'Manuel terapi, egzersiz terapisi gibi modern ve kanıta dayalı teknikler kullanıyoruz.',
      icon: IconShield
    }
  ]

  const testimonials = [
    {
      name: 'Ahmet Yılmaz',
      content: 'Tuğba hanımdan önce bir çok tedavi gördüm hiç birinden sonuç alamadım. Daha 3. Seanstan itibaren boynum ve bacaklarımdaki ağrılara yavaş yavaş veda ediyorum.',
      rating: 5
    },
    {
      name: 'Fatma Demir',
      content: 'Seanslar öncesinde yaşadığım sıkıntılarım 3. Seans sonunda %70 iyi yönde etki göstermeye başladı. Tuğba hocam elinize emeğinize sağlık.',
      rating: 5
    },
    {
      name: 'Mehmet Kaya',
      content: 'Yıllardır bel ağrılarımdan dolayı hem devlet hem özel hastahanelerde tedavi görmüştüm. İlk 2 seans sonrası ağrılarım büyük ölçüde azaldı.',
      rating: 5
    }
  ]

  return (
    <Box>
      <Header user={user} setUser={() => {}} />
      {/* Hero Section */}
      <Box bg="#7a6b5f" py={80}>
        <Container size="lg">
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Stack gap="xl">
                <Title order={1} size="3rem" fw={700} lh={1.2}>
                  Ben Kimim?
                </Title>
                <Text size="lg" c="dimmed" lh={1.6}>
                  Merhaba, ben Tuğba Kazankaya. Fiziksel sağlık ve iyilik halinizi geliştirmek için yıllardır özveriyle çalışıyorum.
                </Text>
                <Text c="dimmed" lh={1.6}>
                  Her bir danışanımın ihtiyaçlarına özel, bilimsel yaklaşımlarla kişiselleştirilmiş tedavi planları sunuyorum. Amacım, size daha sağlıklı, ağrısız ve hareket özgürlüğü yüksek bir yaşam sunmak.
                </Text>
                <Group>
                  <Button size="lg" component={Link} href="/appointments">
                    Randevu Al
                  </Button>
                  <Button size="lg" variant="outline" component={Link} href="/contact">
                    İletişime Geç
                  </Button>
                </Group>
              </Stack>
            </Grid.Col>
            
          </Grid>
        </Container>
      </Box>

      {/* Achievements */}
      <Container size="lg" py={80}>
        <Stack align="center" gap="xl" mb={60}>
          <Title order={2} ta="center">
            Başarılarım
          </Title>
          <Text size="lg" c="dimmed" ta="center">
            Yılların deneyimi ve başarılı tedavi süreçleri
          </Text>
        </Stack>

        <SimpleGrid cols={{ base: 2, md: 4 }} spacing="xl">
          {achievements.map((achievement, index) => (
            <Paper key={index} p="xl" withBorder ta="center">
              <Stack align="center" gap="md">
                <ThemeIcon size={60} radius="xl" variant="light" color={achievement.color}>
                  <achievement.icon size={30} />
                </ThemeIcon>
                <Title order={3}>{achievement.title}</Title>
                <Text size="sm" c="dimmed" ta="center">
                  {achievement.description}
                </Text>
              </Stack>
            </Paper>
          ))}
        </SimpleGrid>
      </Container>

      {/* Values */}
      <Box bg="#7a6b5f" py={80}>
        <Container size="lg">
          <Stack align="center" gap="xl" mb={60}>
            <Title order={2} ta="center">
              Değerlerim
            </Title>
            <Text size="lg" c="dimmed" ta="center">
              Tedavi yaklaşımımızın temelini oluşturan değerler
            </Text>
          </Stack>

          <Grid>
            {values.map((value, index) => (
              <Grid.Col key={index} span={{ base: 12, md: 4 }}>
                <Card shadow="sm" padding="xl" radius="md" withBorder h="100%">
                  <Stack gap="md" h="100%">
                    <ThemeIcon size={50} radius="xl" variant="light" color="blue">
                      <value.icon size={25} />
                    </ThemeIcon>
                    <Title order={3}>{value.title}</Title>
                    <Text c="dimmed">{value.description}</Text>
                  </Stack>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Specializations */}
      <Container size="lg" py={80}>
        <Stack align="center" gap="xl" mb={60}>
          <Title order={2} ta="center">
            Uzmanlık Alanlarım
          </Title>
          <Text size="lg" c="dimmed" ta="center">
            Geniş yelpazede uzmanlık alanları
          </Text>
        </Stack>

        <SimpleGrid cols={{ base: 2, md: 4 }} spacing="md">
          {specializations.map((specialization, index) => (
            <Badge key={index} size="lg" variant="light" color="blue">
              {specialization}
            </Badge>
          ))}
        </SimpleGrid>
      </Container>

      {/* Testimonials */}
      <Box bg="#7a6b5f" py={80}>
        <Container size="lg">
          <Stack align="center" gap="xl" mb={60}>
            <Title order={2} ta="center">
              Hastalarımdan Yorumlar
            </Title>
            <Text size="lg" c="dimmed" ta="center">
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
                  <Text size="sm" c="dimmed">
                    "{testimonial.content}"
                  </Text>
                  <Group>
                    <Avatar size="md" radius="xl" color="blue">
                      {testimonial.name[0]}
                    </Avatar>
                    <div>
                      <Text fw={500}>{testimonial.name}</Text>
                      <Text size="sm" c="dimmed">Hasta</Text>
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
        <Paper p="xl" radius="md" withBorder>
          <Stack align="center" gap="xl">
            <Title order={2} ta="center">
              En büyük motivasyonum ağrısız yaşama kavuşan hastalarım
            </Title>
            <Text size="lg" c="dimmed" ta="center" maw={600}>
              Sizi de sağlıklı bir yaşama kavuşturmak için buradayım
            </Text>
            <Group>
              <Button size="lg" component={Link} href="/appointments">
                Randevu Al
              </Button>
              <Button size="lg" variant="outline" component={Link} href="/contact">
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
