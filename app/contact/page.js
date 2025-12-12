'use client'
function showNotification({ title, message, color }) {
  alert(`${title}\n${message}`);
}

import { useState } from 'react'
import { useForm } from '@mantine/form'
import {
  Container,
  Title,
  Text,
  Grid,
  Card,
  Stack,
  TextInput,
  Textarea,
  Button,
  Group,
  Box,
  Paper,
  ThemeIcon,
  SimpleGrid,
  Alert,
} from '@mantine/core'
import { useNotifications } from '@mantine/notifications'
import {
  IconMapPin,
  IconPhone,
  IconMail,
  IconClock,
  IconCheck,
  IconAlertCircle,
  IconCalendar,
  IconUser,
} from '@tabler/icons-react'
import Link from 'next/link'
import { Header } from '../../components/Header'
import { Footer } from '../../components/Footer'
import { useLocalStorage } from '@mantine/hooks'

export default function Contact() {
  const [user] = useLocalStorage({ key: 'user', defaultValue: null })
  const notifications = useNotifications()
  const [loading, setLoading] = useState(false)

  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    },
    validate: {
      name: (value) => (!value ? 'Ad soyad gerekli' : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Geçerli email girin'),
      phone: (value) => (!value ? 'Telefon gerekli' : null),
      subject: (value) => (!value ? 'Konu gerekli' : null),
      message: (value) => (!value ? 'Mesaj gerekli' : null),
    },
  })

  const handleSubmit = async (values) => {
    setLoading(true)
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      notifications.show({
        title: 'Başarılı',
        message: 'Mesajınız başarıyla gönderildi. En kısa sürede dönüş yapacağız.',
        color: 'green',
        icon: <IconCheck size={16} />,
      })
      
      form.reset()
    } catch (error) {
      notifications.show({
        title: 'Hata',
        message: 'Mesaj gönderilemedi. Lütfen tekrar deneyin.',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      })
    } finally {
      setLoading(false)
    }
  }

  const contactInfo = [
    {
      icon: IconMapPin,
      title: 'Adres',
      content: 'Suadiye Mahallesi Bağdat Caddesi Berna Sokak İkramiye Apartmanı No: 4 D: 23 Kadıköy İstanbul',
      color: 'blue'
    },
    {
      icon: IconPhone,
      title: 'Telefon',
      content: '0850 360 88 22',
      color: 'green'
    },
    {
      icon: IconMail,
      title: 'Email',
      content: 'info@veriproje.com',
      color: 'orange'
    },
    {
      icon: IconClock,
      title: 'Çalışma Saatleri',
      content: 'Pazartesi - Cuma: 08:00 - 20:00\nCumartesi: 08:00 - 15:00',
      color: 'violet'
    }
  ]

  const quickActions = [
    {
      title: 'Randevu Al',
      description: 'Online randevu sistemi ile kolayca randevu alın',
      icon: IconCalendar,
      color: 'blue',
      href: '/appointments'
    }
  ]

  return (
    <Box>
      <Header user={user} setUser={() => {}} />
      {/* Hero Section */}
      <Box bg="#7a6b5f" py={80}>
        <Container size="lg">
          <Stack align="center" gap="xl">
            <Title order={1} size="3rem" ta="center" fw={700} lh={1.2}>
              İletişim
            </Title>
            <Text size="xl" c="dimmed" ta="center" maw={600} lh={1.6}>
              Sorularınız için bizimle iletişime geçin. Size yardımcı olmaktan mutluluk duyarız.
            </Text>
          </Stack>
        </Container>
      </Box>

      {/* Contact Info */}
      <Container size="lg" py={80}>
        <SimpleGrid cols={{ base: 1, md: 2, lg: 4 }} spacing="xl" mb={60}>
          {contactInfo.map((info, index) => (
            <Paper key={index} p="xl" withBorder>
              <Stack align="center" gap="md">
                <ThemeIcon size={50} radius="xl" variant="light" color={info.color}>
                  <info.icon size={25} />
                </ThemeIcon>
                <Title order={4} ta="center">{info.title}</Title>
                <Text size="sm" c="dimmed" ta="center" style={{ whiteSpace: 'pre-line' }}>
                  {info.content}
                </Text>
              </Stack>
            </Paper>
          ))}
        </SimpleGrid>

        <Grid>
          {/* Contact Form */}
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Card shadow="sm" padding="xl" radius="md" withBorder>
              <Stack gap="xl">
                <div>
                  <Title order={2}>Bize Mesaj Gönderin</Title>
                  <Text c="dimmed">Sorularınızı, önerilerinizi veya randevu taleplerinizi bize iletin.</Text>
                </div>

                <form onSubmit={form.onSubmit(handleSubmit)}>
                  <Stack gap="md">
                    <Grid>
                      <Grid.Col span={6}>
                        <TextInput
                          label="Ad Soyad"
                          placeholder="Adınız ve soyadınız"
                          required
                          {...form.getInputProps('name')}
                        />
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <TextInput
                          label="Telefon"
                          placeholder="0555 123 45 67"
                          required
                          {...form.getInputProps('phone')}
                        />
                      </Grid.Col>
                    </Grid>

                    <TextInput
                      label="Email"
                      placeholder="email@example.com"
                      required
                      {...form.getInputProps('email')}
                    />

                    <TextInput
                      label="Konu"
                      placeholder="Mesaj konusu"
                      required
                      {...form.getInputProps('subject')}
                    />

                    <Textarea
                      label="Mesaj"
                      placeholder="Mesajınızı buraya yazın..."
                      required
                      minRows={4}
                      {...form.getInputProps('message')}
                    />

                    <Button
                      type="submit"
                      size="lg"
                      loading={loading}
                      fullWidth
                    >
                      Mesaj Gönder
                    </Button>
                  </Stack>
                </form>
              </Stack>
            </Card>
          </Grid.Col>

          {/* Quick Actions */}
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Stack gap="md">
              <Title order={3}>Hızlı İşlemler</Title>
              
              {quickActions.map((action, index) => (
                <Card key={index} shadow="sm" padding="md" radius="md" withBorder>
                  <Stack gap="sm">
                    <Group>
                      <ThemeIcon size={40} radius="xl" variant="light" color={action.color}>
                        <action.icon size={20} />
                      </ThemeIcon>
                      <div>
                        <Text fw={500}>{action.title}</Text>
                        <Text size="sm" c="dimmed">{action.description}</Text>
                      </div>
                    </Group>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      fullWidth
                      component={Link}
                      href={action.href}
                    >
                      {action.title}
                    </Button>
                  </Stack>
                </Card>
              ))}

              
            </Stack>
          </Grid.Col>
        </Grid>
      </Container>

      {/* Map Section */}
      <Box bg="#7a6b5f" py={80}>
        <Container size="lg">
          <Stack align="center" gap="xl">
            <Title order={2} ta="center">
              Konumumuz
            </Title>
            <Text size="lg" c="dimmed" ta="center">
              Kadıköy, İstanbul'da merkezi konumda hizmet veriyoruz
            </Text>
            
            <Paper p="xl" withBorder radius="md" style={{ width: '100%', height: '400px' }}>
              <Stack align="center" justify="center" h="100%">
                <ThemeIcon size={60} radius="xl" variant="light" color="blue">
                  <IconMapPin size={30} />
                </ThemeIcon>
                <Title order={3}>Harita</Title>
                <Text c="dimmed" ta="center">
                  Suadiye Mahallesi Bağdat Caddesi<br />
                  Berna Sokak İkramiye Apartmanı No: 4 D: 23<br />
                  Kadıköy, İstanbul
                </Text>
                <Button variant="outline" component="a" href="https://maps.google.com" target="_blank">
                  Google Maps'te Aç
                </Button>
              </Stack>
            </Paper>
          </Stack>
        </Container>
      </Box>
      
      <Footer />
    </Box>
  )
}
