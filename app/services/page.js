'use client'

import {
  Container,
  Title,
  Text,
  SimpleGrid,
  Card,
  Stack,
  ThemeIcon,
  Group,
  Button,
  Box,
  Paper,
  List,
  Divider,
  Grid,
  Avatar,
} from '@mantine/core'
import {
  IconUser,
  IconUsers,
  IconHeart,
  IconBrain,
  IconActivity,
  IconShield,
  IconClock,
  IconCheck,
  IconArrowRight,
  IconCalendar,
} from '@tabler/icons-react'
import Link from 'next/link'
import { Header } from '../../components/Header'
import { Footer } from '../../components/Footer'
import { useLocalStorage } from '@mantine/hooks'

export default function Services() {
  const [user] = useLocalStorage({ key: 'user', defaultValue: null })
 
  const processSteps = [
    {
      step: 1,
      title: 'İlk Görüşme',
      description: 'İhtiyaçlarınızı değerlendiriyoruz',
      icon: IconCalendar
    },
    {
      step: 2,
      title: 'Tedavi Planı',
      description: 'Size özel tedavi planı oluşturuyoruz',
      icon: IconCheck
    },
    {
      step: 3,
      title: 'Terapi Süreci',
      description: 'Düzenli seanslarla iyileşme sürecinizi takip ediyoruz',
      icon: IconActivity
    },
    {
      step: 4,
      title: 'Sonuç',
      description: 'Hedeflerinize ulaştığınızda süreci tamamlıyoruz',
      icon: IconShield
    }
  ]

  return (
    <Box>
      <Header user={user} setUser={() => {}} />
      {/* Hero Section */}
      <Box bg="#7a6b5f" py={80}>
        <Container size="lg">
          <Stack align="center" gap="xl">
            <Title order={1} ta="center" size="3rem" fw={700} lh={1.2}>
              Hizmetlerimiz
            </Title>
            <Text size="xl" c="dimmed" ta="center" maw={600} lh={1.6}>
              Size özel tedavi planları ile sağlıklı bir yaşam için yanınızdayız
            </Text>
            <Button size="lg" component={Link} href="/appointments">
              Randevu Al
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Services Grid */}
      <Container size="lg" py={80}>
        <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="xl">
          {services.map((service, index) => (
            <Card key={index} shadow="sm" padding="xl" radius="md" withBorder h="100%">
              <Stack gap="md" h="100%">
                <Group>
                  <ThemeIcon size={50} radius="xl" variant="light" color={service.color}>
                    <service.icon size={25} />
                  </ThemeIcon>
                  <div>
                    <Title order={3}>{service.title}</Title>
                    <Text size="sm" c="dimmed">{service.duration}</Text>
                  </div>
                </Group>

                <Text c="dimmed">{service.description}</Text>

                <List spacing="xs" size="sm">
                  {service.features.map((feature, i) => (
                    <List.Item key={i} icon={<IconCheck size={14} />}>
                      {feature}
                    </List.Item>
                  ))}
                </List>

                <Divider />

                <Group justify="space-between">
                  <Text size="lg" fw={700} c={service.color}>
                    {service.price}
                  </Text>
                  <Button variant="outline" size="sm">
                    Detay
                  </Button>
                </Group>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      </Container>

      {/* Process Section */}
      <Box bg="#7a6b5f" py={80}>
        <Container size="lg">
          <Stack align="center" gap="xl" mb={60}>
            <Title order={2} ta="center">
              Tedavi Sürecimiz
            </Title>
            <Text size="lg" c="dimmed" ta="center">
              Adım adım iyileşme süreciniz
            </Text>
          </Stack>

          <Grid>
            {processSteps.map((step, index) => (
              <Grid.Col key={index} span={{ base: 12, md: 6, lg: 3 }}>
                <Paper p="xl" withBorder ta="center">
                  <Stack align="center" gap="md">
                    <ThemeIcon size={60} radius="xl" variant="light" color="blue">
                      <step.icon size={30} />
                    </ThemeIcon>
                    <Title order={3}>Adım {step.step}</Title>
                    <Title order={4}>{step.title}</Title>
                    <Text size="sm" c="dimmed" ta="center">
                      {step.description}
                    </Text>
                  </Stack>
                </Paper>
              </Grid.Col>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container size="lg" py={80}>
        <Paper p="xl" radius="md" withBorder>
          <Stack align="center" gap="xl">
            <Title order={2} ta="center">
              Hangi Hizmete İhtiyacınız Var?
            </Title>
            
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
