'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from '@mantine/form'
import {
  Container,
  Title,
  Text,
  Grid,
  Card,
  Group,
  Button,
  Stack,
  TextInput,
  Select,
  Avatar,
  Paper,
  Alert,
  LoadingOverlay,
} from '@mantine/core'
import { useNotifications } from '@mantine/notifications'
import {
  IconUser,
  IconMail,
  IconPhone,
  IconCalendar,
  IconCheck,
  IconAlertCircle,
} from '@tabler/icons-react'
import { userAPI } from '../../services/api'

export default function Profile() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)
  const notifications = useNotifications()

  const form = useForm({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: 'patient',
      specialization: '',
      experience: '',
      bio: '',
    },
  })

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/login')
      return
    }
    
    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    form.setValues({
      firstName: parsedUser?.firstName || '',
      lastName: parsedUser?.lastName || '',
      email: parsedUser?.email || '',
      phone: parsedUser?.phone || '',
      role: parsedUser?.role || 'patient',
      specialization: parsedUser?.specialization || '',
      experience: parsedUser?.experience || '',
      bio: parsedUser?.bio || '',
    })
  }, [router])

  const handleSubmit = async (values) => {
    setLoading(true)
    try {
      const response = await userAPI.updateProfile(values)
      const updatedUser = response.data
      
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
      
      notifications.show({
        title: 'Başarılı',
        message: 'Profil güncellendi',
        color: 'green',
        icon: <IconCheck size={16} />,
      })
    } catch (error) {
      notifications.show({
        title: 'Hata',
        message: error.response?.data?.message || 'Profil güncellenemedi',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      })
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <Container size="md">
      <Stack>
        <Title order={1}>Profil</Title>
        <Text c="dimmed" size="lg">
          Profil bilgilerinizi düzenleyin
        </Text>

        <Grid>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Card withBorder>
              <Stack align="center">
                <Avatar size={120} radius="xl" color="blue">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </Avatar>
                <div style={{ textAlign: 'center' }}>
                  <Title order={3}>
                    {user?.firstName} {user?.lastName}
                  </Title>
                  <Text c="dimmed" size="sm">
                    {user?.role === 'therapist' ? 'Terapist' : 'Hasta'}
                  </Text>
                </div>
              </Stack>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 8 }}>
            <Card withBorder>
              <form onSubmit={form.onSubmit(handleSubmit)}>
                <LoadingOverlay visible={loading} />
                <Stack>
                  <Grid>
                    <Grid.Col span={6}>
                      <TextInput
                        label="Ad"
                        placeholder="Adınız"
                        leftSection={<IconUser size={16} />}
                        required
                        {...form.getInputProps('firstName')}
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <TextInput
                        label="Soyad"
                        placeholder="Soyadınız"
                        leftSection={<IconUser size={16} />}
                        required
                        {...form.getInputProps('lastName')}
                      />
                    </Grid.Col>
                  </Grid>

                  <TextInput
                    label="Email"
                    placeholder="email@example.com"
                    leftSection={<IconMail size={16} />}
                    required
                    {...form.getInputProps('email')}
                  />

                  <TextInput
                    label="Telefon"
                    placeholder="0555 123 45 67"
                    leftSection={<IconPhone size={16} />}
                    required
                    {...form.getInputProps('phone')}
                  />

                  <Select
                    label="Rol"
                    placeholder="Rolünüzü seçin"
                    data={[
                      { value: 'patient', label: 'Hasta' },
                      { value: 'therapist', label: 'Terapist' },
                    ]}
                    disabled
                    {...form.getInputProps('role')}
                  />

                  {user?.role === 'therapist' && (
                    <>
                      <TextInput
                        label="Uzmanlık Alanı"
                        placeholder="Uzmanlık alanınız"
                        {...form.getInputProps('specialization')}
                      />

                      <TextInput
                        label="Deneyim"
                        placeholder="Kaç yıllık deneyim"
                        {...form.getInputProps('experience')}
                      />
                    </>
                  )}

                  <TextInput
                    label="Hakkımda"
                    placeholder="Kendiniz hakkında kısa bilgi"
                    {...form.getInputProps('bio')}
                  />

                  <Group justify="flex-end" mt="md">
                    <Button type="submit" loading={loading}>
                      Güncelle
                    </Button>
                  </Group>
                </Stack>
              </form>
            </Card>
          </Grid.Col>
        </Grid>

        {user?.role === 'therapist' && (
          <Card withBorder>
            <Title order={3} mb="md">Terapist Bilgileri</Title>
            <Grid>
              <Grid.Col span={6}>
                <Paper p="md" withBorder>
                  <Group>
                    <IconCalendar size={24} color="blue" />
                    <div>
                      <Text fw={500}>Uzmanlık Alanı</Text>
                      <Text size="sm" c="dimmed">
                        {user?.specialization || 'Belirtilmemiş'}
                      </Text>
                    </div>
                  </Group>
                </Paper>
              </Grid.Col>
              <Grid.Col span={6}>
                <Paper p="md" withBorder>
                  <Group>
                    <IconUser size={24} color="green" />
                    <div>
                      <Text fw={500}>Deneyim</Text>
                      <Text size="sm" c="dimmed">
                        {user?.experience || 'Belirtilmemiş'}
                      </Text>
                    </div>
                  </Group>
                </Paper>
              </Grid.Col>
            </Grid>
          </Card>
        )}
      </Stack>
    </Container>
  )
}
