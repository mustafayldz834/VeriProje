'use client'

import { useForm } from '@mantine/form'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Stack,
  Anchor,
  Container,
  Center,
  Select,
  Grid,
} from '@mantine/core'
import { useNotifications } from '@mantine/notifications'
import { IconAlertCircle } from '@tabler/icons-react'
import { authAPI } from '../../services/api'
import { useState } from 'react'
import { Header } from '../../components/Header'
import { Footer } from '../../components/Footer'
import { useLocalStorage } from '@mantine/hooks'

export default function Register() {
  const [user, setUser] = useLocalStorage({ key: 'user', defaultValue: null })
  const router = useRouter()
  const notifications = useNotifications()
  const [loading, setLoading] = useState(false)

  const form = useForm({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'patient',
      phone: '',
    },
    validate: {
      firstName: (value) => (value.length < 2 ? 'Ad en az 2 karakter olmalı' : null),
      lastName: (value) => (value.length < 2 ? 'Soyad en az 2 karakter olmalı' : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Geçerli bir email adresi girin'),
      password: (value) => (value.length < 6 ? 'Şifre en az 6 karakter olmalı' : null),
      confirmPassword: (value, values) =>
        value !== values.password ? 'Şifreler eşleşmiyor' : null,
      phone: (value) => (value.length < 10 ? 'Geçerli bir telefon numarası girin' : null),
    },
  })

  const handleSubmit = async (values) => {
    setLoading(true)
    try {
      const response = await authAPI.register(values)
      const { user, token } = response.data
      
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      
      notifications.show({
        title: 'Başarılı',
        message: 'Hesap oluşturuldu',
        color: 'green',
      })
      
      router.push('/dashboard')
    } catch (error) {
      notifications.show({
        title: 'Hata',
        message: error.response?.data?.message || 'Kayıt oluşturulamadı',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header user={user} setUser={setUser} />
      <Container size={600} my={40}>
      <Center>
        <Stack>
          <Title ta="center" order={2} fw={600} lh={1.3}>
            Kayıt Ol
          </Title>
          <Text c="dimmed" size="sm" ta="center" mt={5} lh={1.5}>
            Zaten hesabınız var mı?{' '}
            <Anchor size="sm" component={Link} href="/login">
              Giriş yapın
            </Anchor>
          </Text>

          <Paper withBorder shadow="md" p={30} mt={30} radius="md">
            <form onSubmit={form.onSubmit(handleSubmit)}>
              <Stack>
                <Grid>
                  <Grid.Col span={6}>
                    <TextInput
                      label="Ad"
                      placeholder="Adınız"
                      required
                      {...form.getInputProps('firstName')}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      label="Soyad"
                      placeholder="Soyadınız"
                      required
                      {...form.getInputProps('lastName')}
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
                  label="Telefon"
                  placeholder="0555 123 45 67"
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
                  required
                  {...form.getInputProps('role')}
                />

                <PasswordInput
                  label="Şifre"
                  placeholder="Şifrenizi girin"
                  required
                  {...form.getInputProps('password')}
                />

                <PasswordInput
                  label="Şifre Tekrar"
                  placeholder="Şifrenizi tekrar girin"
                  required
                  {...form.getInputProps('confirmPassword')}
                />

                <Button
                  type="submit"
                  fullWidth
                  mt="xl"
                  loading={loading}
                >
                  Kayıt Ol
                </Button>
              </Stack>
            </form>
          </Paper>
        </Stack>
      </Center>
    </Container>
    <Footer />
    </>
  )
}
