'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Container,
  Title,
  Text,
  Grid,
  Card,
  Group,
  Button,
  Stack,
  Badge,
  Avatar,
  ThemeIcon,
  SimpleGrid,
  Paper,
} from '@mantine/core'
import {
  IconCalendar,
  IconUser,
  IconClock,
  IconCheck,
  IconX,
  IconPlus,
  IconUsers,
} from '@tabler/icons-react'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/login')
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  if (!user) {
    return null
  }

  const [stats, setStats] = useState([])
  const [recentAppointments, setRecentAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Load stats
      const statsResponse = await import('../../services/api').then(api => api.statsAPI.getDashboardStats())
      setStats([
        { title: 'Toplam Randevu', value: statsResponse.data.totalAppointments.toString(), icon: IconCalendar, color: 'blue' },
        { title: 'Bu Hafta', value: statsResponse.data.thisWeek.toString(), icon: IconClock, color: 'green' },
        { title: 'Tamamlanan', value: statsResponse.data.completed.toString(), icon: IconCheck, color: 'teal' },
        { title: 'İptal Edilen', value: statsResponse.data.cancelled.toString(), icon: IconX, color: 'red' },
      ])

      // Load recent appointments
      const appointmentsResponse = await import('../../services/api').then(api => api.appointmentAPI.getMyAppointments())
      setRecentAppointments(appointmentsResponse.data.slice(0, 3))
    } catch (error) {
      console.error('Dashboard data loading error:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'green'
      case 'pending': return 'yellow'
      case 'completed': return 'blue'
      case 'cancelled': return 'red'
      default: return 'gray'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed': return 'Onaylandı'
      case 'pending': return 'Beklemede'
      case 'completed': return 'Tamamlandı'
      case 'cancelled': return 'İptal Edildi'
      default: return 'Bilinmiyor'
    }
  }

  const getTypeText = (type) => {
    switch (type) {
      case 'individual': return 'Bireysel Terapi'
      case 'family': return 'Aile Terapisi'
      case 'group': return 'Grup Terapisi'
      case 'couple': return 'Çift Terapisi'
      default: return type
    }
  }

  if (loading) {
    return (
      <Container size="xl">
        <Stack>
          <Group justify="space-between">
            <div>
              <Title order={1}>Yükleniyor...</Title>
              <Text c="dimmed" size="lg">
                Veriler yükleniyor...
              </Text>
            </div>
          </Group>
        </Stack>
      </Container>
    )
  }

  return (
    <Container size="xl">
      <Stack>
        <Group justify="space-between">
          <div>
            <Title order={1} fw={700} lh={1.2}>Hoş Geldiniz, {user?.firstName}!</Title>
            <Text c="dimmed" size="lg" lh={1.6}>
              Terapi randevu sisteminize hoş geldiniz.
            </Text>
          </div>
          <Button
            leftSection={<IconPlus size={16} />}
            component={Link}
            href="/appointments"
            size="lg"
          >
            Yeni Randevu
          </Button>
        </Group>

        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
          {stats.map((stat) => (
            <Paper key={stat.title} p="md" withBorder>
              <Group>
                <ThemeIcon size={40} variant="light" color={stat.color}>
                  <stat.icon size={20} />
                </ThemeIcon>
                <div>
                  <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                    {stat.title}
                  </Text>
                  <Text fw={700} size="xl">
                    {stat.value}
                  </Text>
                </div>
              </Group>
            </Paper>
          ))}
        </SimpleGrid>

        <Grid>
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Card withBorder>
              <Group justify="space-between" mb="md">
                <Title order={3} fw={600} lh={1.3}>Son Randevular</Title>
                <Button variant="subtle" component={Link} href="/appointments">
                  Tümünü Gör
                </Button>
              </Group>

              <Stack>
                {recentAppointments.map((appointment) => (
                  <Paper key={appointment.id} p="md" withBorder>
                    <Group justify="space-between">
                      <Group>
                        <Avatar size="md" radius="xl">
                          {appointment.therapist?.firstName?.[0]}{appointment.therapist?.lastName?.[0]}
                        </Avatar>
                        <div>
                          <Text fw={500} lh={1.4}>{appointment.therapist?.firstName} {appointment.therapist?.lastName}</Text>
                          <Text size="sm" c="dimmed" lh={1.4}>
                            {getTypeText(appointment.type)}
                          </Text>
                        </div>
                      </Group>
                      <div style={{ textAlign: 'right' }}>
                        <Text size="sm" fw={500}>
                          {appointment.date} - {appointment.time}
                        </Text>
                        <Badge color={getStatusColor(appointment.status)} size="sm">
                          {getStatusText(appointment.status)}
                        </Badge>
                      </div>
                    </Group>
                  </Paper>
                ))}
              </Stack>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Card withBorder>
              <Title order={3} mb="md" fw={600} lh={1.3}>Hızlı İşlemler</Title>
              <Stack>
                <Button
                  variant="light"
                  leftSection={<IconCalendar size={16} />}
                  component={Link}
                  href="/appointments"
                  fullWidth
                >
                  Randevularım
                </Button>
                <Button
                  variant="light"
                  leftSection={<IconUser size={16} />}
                  component={Link}
                  href="/profile"
                  fullWidth
                >
                  Profilim
                </Button>
                {user?.role === 'therapist' && (
                  <Button
                    variant="light"
                    leftSection={<IconUsers size={16} />}
                    component={Link}
                    href="/patients"
                    fullWidth
                  >
                    Hastalarım
                  </Button>
                )}
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  )
}
