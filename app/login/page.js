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
  Alert,
} from '@mantine/core'
import { useNotifications } from '@mantine/notifications'
import { IconAlertCircle } from '@tabler/icons-react'
import { authAPI } from '../../services/api'
import { useState } from 'react'
import { Header } from '../../components/Header'
import { Footer } from '../../components/Footer'
import { useLocalStorage } from '@mantine/hooks'

export default function Login() {
  const [user, setUser] = useLocalStorage({ key: 'user', defaultValue: null })
  const router = useRouter()
  const notifications = useNotifications()
  const [loading, setLoading] = useState(false)

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Geçerli bir email adresi girin'),
      password: (value) => (value.length < 6 ? 'Şifre en az 6 karakter olmalı' : null),
    },
  })

  const handleSubmit = async (values) => {
    setLoading(true)
    try {
      const response = await authAPI.login(values)
      const { user, token } = response.data
      
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      
      notifications.show({
        title: 'Başarılı',
        message: 'Giriş yapıldı',
        color: 'green',
      })
      
      router.push('/dashboard')
    } catch (error) {
      notifications.show({
        title: 'Hata',
        message: error.response?.data?.message || 'Giriş yapılamadı',
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
      <Container size={420} my={40}>
      <Center>
        <Stack>
          <Title ta="center" order={2} fw={600} lh={1.3}>
            Giriş Yap
          </Title>
          <Text c="dimmed" size="sm" ta="center" mt={5} lh={1.5}>
            Hesabınız yok mu?{' '}
            <Anchor size="sm" component={Link} href="/register">
              Kayıt olun
            </Anchor>
          </Text>

          <Paper withBorder shadow="md" p={30} mt={30} radius="md">
            <form onSubmit={form.onSubmit(handleSubmit)}>
              <Stack>
                <TextInput
                  label="Email"
                  placeholder="email@example.com"
                  required
                  {...form.getInputProps('email')}
                />

                <PasswordInput
                  label="Şifre"
                  placeholder="Şifrenizi girin"
                  required
                  {...form.getInputProps('password')}
                />

                <Button
                  type="submit"
                  fullWidth
                  mt="xl"
                  loading={loading}
                >
                  Giriş Yap
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
