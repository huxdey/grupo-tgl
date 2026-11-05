import React, { useEffect, useMemo, useRef, useState } from 'react'
import Lenis from 'lenis'
import {
  AnimatePresence, MotionConfig, animate, motion, useAnimationFrame, useInView,
  useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring,
  useTransform, useVelocity, wrap
} from 'framer-motion'

const NUMERO = '5511963562532'
const linkZap = (t) => `https://wa.me/${NUMERO}?text=${encodeURIComponent(t)}`
const ORC = 'Olá, vim pelo site da TGL e quero um orçamento'
const FACIL = [0.22, 1, 0.36, 1]

const IconeZap = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="ico"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
)

function useDesktop(min = 960) {
  const [d, setD] = useState(() => window.matchMedia(`(min-width:${min}px)`).matches)
  useEffect(() => {
    const m = window.matchMedia(`(min-width:${min}px)`)
    const f = () => setD(m.matches)
    m.addEventListener('change', f)
    return () => m.removeEventListener('change', f)
  }, [min])
  return d
}

/* Entrada ao rolar. Começa fraca, nunca invisível, para o conteúdo existir mesmo parado. */
function Surge({ children, atraso = 0, y = 34, className, as = 'div' }) {
  const M = motion[as]
  return (
    <M className={className} initial={{ opacity: 0.14, y }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8% 0px' }} transition={{ duration: 0.8, delay: atraso, ease: FACIL }}>
      {children}
    </M>
  )
}

/* Título que sobe palavra por palavra */
function Palavras({ texto, como = 'h2', className, atraso = 0, naCarga = false }) {
  const T = como
  const pais = { hidden: {}, show: { transition: { staggerChildren: 0.045, delayChildren: atraso } } }
  const filho = { hidden: { y: '108%' }, show: { y: 0, transition: { duration: 0.75, ease: FACIL } } }
  const gatilho = naCarga ? { animate: 'show' } : { whileInView: 'show', viewport: { once: true, margin: '-6% 0px' } }
  return (
    <T className={className} aria-label={texto}>
      <motion.span aria-hidden="true" className="palavras" variants={pais} initial="hidden" {...gatilho}>
        {texto.split(' ').map((p, i) => (
          <React.Fragment key={i}><span className="palavra"><motion.span variants={filho}>{p}</motion.span></span>{' '}</React.Fragment>
        ))}
      </motion.span>
    </T>
  )
}

function Botao({ href, children, tipo = 'ouro', externo = true, ...resto }) {
  return (
    <motion.a className={`botao botao-${tipo}`} href={href} {...(externo ? { target: '_blank', rel: 'noopener' } : {})}
      whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }} transition={{ type: 'spring', stiffness: 420, damping: 26 }} {...resto}>
      {children}
    </motion.a>
  )
}

const MENU = [['pos-obra', 'Pós-obra'], ['servicos', 'Serviços'], ['etapas', 'Como funciona'], ['empresa', 'A empresa']]

function Topo() {
  const { scrollY, scrollYProgress } = useScroll()
  const barra = useSpring(scrollYProgress, { stiffness: 140, damping: 30 })
  const [oculto, setOculto] = useState(false)
  const [aberto, setAberto] = useState(false)
  const [ativo, setAtivo] = useState('')

  useMotionValueEvent(scrollY, 'change', (y) => {
    const ant = scrollY.getPrevious() ?? 0
    setOculto(y > ant && y > 320)
  })
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setAtivo(e.target.id)), { rootMargin: '-45% 0px -50% 0px' })
    MENU.forEach(([id]) => { const el = document.getElementById(id); if (el) io.observe(el) })
    return () => io.disconnect()
  }, [])
  useEffect(() => {
    document.documentElement.classList.toggle('travado', aberto)
  }, [aberto])

  return (
    <>
      <motion.header className="topo" animate={{ y: oculto && !aberto ? '-100%' : 0 }} transition={{ duration: 0.35, ease: FACIL }}>
        <div className="gutter"><div className="miolo topo-linha">
          <a className="marca" href="#inicio" aria-label="TGL, início"><img src="img/logo-h.webp" alt="TGL" width="692" height="240" /></a>
          <nav className="menu" aria-label="Seções">
            {MENU.map(([id, nome]) => (
              <a key={id} href={`#${id}`} className={ativo === id ? 'ativo' : ''}>
                {nome}
                {ativo === id && <motion.span className="menu-traco" layoutId="traco" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
              </a>
            ))}
          </nav>
          <a className="botao botao-ouro botao-p" href="#contato">Pedir orçamento</a>
          <button id="abrir-menu" type="button" className={`burger ${aberto ? 'x' : ''}`} aria-label={aberto ? 'Fechar menu' : 'Abrir menu'} aria-expanded={aberto} onClick={() => setAberto(!aberto)}><i /><i /></button>
        </div></div>
        <motion.div className="barra" style={{ scaleX: barra }} />
      </motion.header>
      <AnimatePresence>
        {aberto && (
          <motion.nav className="gaveta" aria-label="Menu" initial={{ clipPath: 'inset(0 0 100% 0)' }} animate={{ clipPath: 'inset(0 0 0% 0)' }} exit={{ clipPath: 'inset(0 0 100% 0)' }} transition={{ duration: 0.45, ease: FACIL }}>
            {[...MENU, ['contato', 'Pedir orçamento']].map(([id, nome], i) => (
              <motion.a key={id} href={`#${id}`} onClick={() => setAberto(false)} initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.05, duration: 0.45, ease: FACIL }}>{nome}</motion.a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  )
}

function Cinco() {
  const ref = useRef(null)
  const visto = useInView(ref, { once: true })
  const [n, setN] = useState(1)
  useEffect(() => {
    if (!visto) return
    const c = animate(1, 5, { duration: 1.1, ease: 'easeOut', onUpdate: (v) => setN(Math.round(v)) })
    return () => c.stop()
  }, [visto])
  return <strong ref={ref}>Até {n} dias</strong>
}

function Capa() {
  const ref = useRef(null)
  const desktop = useDesktop()
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start 92%', 'start 8%'] })
  const lado = useTransform(p, [0, 1], [desktop ? 7 : 0, 0])
  const canto = useTransform(p, [0, 1], [desktop ? 18 : 0, 0])
  const recorte = useTransform([lado, canto], ([l, c]) => `inset(0% ${l}% 0% ${l}% round ${c}px)`)
  const { scrollYProgress: q } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const fotoY = useTransform(q, [0, 1], ['-9%', '0%'])
  const fotoEsc = useTransform(p, [0, 1], [1.08, 1])

  return (
    <section className="capa" id="inicio">
      <div className="gutter"><div className="miolo capa-grade">
        <div>
          <motion.p className="rotulo" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>Limpeza, portaria e zeladoria em São Paulo</motion.p>
          <Palavras como="h1" naCarga atraso={0.08} texto="Sua obra pronta para a vistoria, na data combinada." />
        </div>
        <motion.div className="capa-lado" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.55, ease: FACIL }}>
          <p className="lede">A TGL faz limpeza pós-obra para construtoras e incorporadoras. Também atende condomínios e empresas com limpeza geral, portaria, controle de acesso e zeladoria.</p>
          <div className="acoes">
            <Botao href={linkZap(`${ORC}.`)}><IconeZap />Falar no WhatsApp</Botao>
            <Botao href="#pos-obra" tipo="linha" externo={false}>Ver a limpeza acontecer</Botao>
          </div>
        </motion.div>
      </div></div>
      <div className="capa-palco" ref={ref}>
        <motion.div className="capa-janela" style={{ clipPath: recorte }} initial={{ opacity: 0.2 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
          <motion.img style={{ y: fotoY, scale: fotoEsc }} src="img/pos-obra.webp" srcSet="img/pos-obra-900.webp 900w, img/pos-obra.webp 1672w" sizes="100vw" width="1672" height="941" alt="Duas pessoas da equipe com uniforme preto e dourado limpando o piso de um andar em fase final de obra, com vista para São Paulo" fetchpriority="high" />
        </motion.div>
        <div className="gutter fatos-camada"><ul className="miolo fatos">
          <Surge as="li"><Cinco /><span>para a equipe começar, depois da aprovação.</span></Surge>
          <Surge as="li" atraso={0.1}><strong>Medição por diária</strong><span>com dias, efetivo e área atendida registrados.</span></Surge>
          <Surge as="li" atraso={0.2}><strong>Empresa ativa desde 2024</strong><span>CNPJ 57.602.707/0001-95, em São Paulo.</span></Surge>
        </ul></div>
      </div>
    </section>
  )
}

/* Faixa que acelera e inverte com a rolagem */
function Letreiro() {
  const reduzido = useReducedMotion()
  const base = useMotionValue(0)
  const { scrollY } = useScroll()
  const vel = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 300 })
  const fator = useTransform(vel, [-1500, 0, 1500], [-4, 0, 4], { clamp: false })
  const sentido = useRef(1)
  useAnimationFrame((_, dt) => {
    if (reduzido) return
    const f = fator.get()
    if (f < 0) sentido.current = -1
    else if (f > 0) sentido.current = 1
    base.set(base.get() + sentido.current * 1.1 * (dt / 1000) * (1 + Math.abs(f)))
  })
  const x = useTransform(base, (v) => `${wrap(-25, 0, -v)}%`)
  const itens = ['Limpeza pós-obra', 'Limpeza geral', 'Portaria', 'Controle de acesso', 'Zeladoria']
  return (
    <div className="letreiro" aria-hidden="true">
      <motion.div className="letreiro-trilho" style={{ x }}>
        {[0, 1, 2, 3].map((k) => (
          <div key={k} className="letreiro-grupo">{itens.map((t) => <span key={t}>{t}<i /></span>)}</div>
        ))}
      </motion.div>
    </div>
  )
}

const CAPITULOS = [
  { nome: 'Piso', texto: 'Poeira de gesso, respingos de tinta e restos de argamassa saem até o porcelanato aparecer.', img: 'piso', alt: 'piso de porcelanato' },
  { nome: 'Vidros e caixilhos', texto: 'Fita, massa e respingos saem do vidro e do alumínio, sem deixar marcas para a vistoria.', img: 'janela', alt: 'janela de alumínio' },
  { nome: 'Banheiros', texto: 'Bancada, louças, metais, box e rejunte limpos, peça por peça.', img: 'banheiro', alt: 'banheiro' }
]

function Camada({ i, n, p, cap }) {
  const ini = i / n
  const fim = (i + 1) / n
  const larg = fim - ini
  const entra = useTransform(p, [ini - larg * 0.14, ini + larg * 0.06], [100, 0])
  const recorte = useTransform(entra, (v) => (i === 0 ? 'none' : `inset(${v}% 0 0 0)`))
  const varre = useTransform(p, [ini + larg * 0.1, ini + larg * 0.82], [0, 100])
  const depois = useTransform(varre, (v) => `inset(0 ${100 - v}% 0 0)`)
  const linha = useTransform(varre, (v) => `${v}%`)
  const opLinha = useTransform(varre, [0, 3, 97, 100], [1, 1, 1, 0])
  const opAntes = useTransform(varre, [70, 88], [1, 0])
  const opDepois = useTransform(varre, [14, 30], [0, 1])
  const esc = useTransform(p, [ini, fim], [1.05, 1])
  return (
    <motion.div className="camada" style={{ clipPath: recorte, zIndex: i + 1 }}>
      <motion.img style={{ scale: esc }} src={`img/${cap.img}-antes.webp`} alt={`${cap.alt} antes da limpeza`} width="827" height="941" />
      <motion.img style={{ scale: esc, clipPath: depois }} src={`img/${cap.img}-depois.webp`} alt={`${cap.alt} depois da limpeza`} width="827" height="941" />
      <motion.span className="rodo" style={{ left: linha, opacity: opLinha }} />
      <motion.span className="tag tag-d" style={{ opacity: opDepois }}>Depois</motion.span>
      <motion.span className="tag tag-a" style={{ opacity: opAntes }}>Antes</motion.span>
    </motion.div>
  )
}

function Tick({ i, n, p }) {
  const s = useTransform(p, [i / n, (i + 1) / n], [0, 1])
  return <span className="tick"><motion.i style={{ scaleX: s }} /></span>
}

function LimpezaRolando() {
  const ref = useRef(null)
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const [idx, setIdx] = useState(0)
  const n = CAPITULOS.length
  const opAviso = useTransform(p, [0, 0.93, 0.98], [1, 1, 0])
  useMotionValueEvent(p, 'change', (v) => setIdx(Math.min(n - 1, Math.max(0, Math.floor(v * n)))))
  const c = CAPITULOS[idx]
  return (
    <div className="rolar" ref={ref}>
      <div className="rolar-fixo gutter">
        <div className="miolo rolar-grade">
          <div className="rolar-texto">
            <p className="rotulo rotulo-claro">Role e veja a limpeza acontecer</p>
            <div className="rolar-troca">
              <AnimatePresence mode="wait">
                <motion.div key={c.nome} initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.32, ease: FACIL }}>
                  <h3>{c.nome}</h3>
                  <p>{c.texto}</p>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="ticks">{CAPITULOS.map((_, i) => <Tick key={i} i={i} n={n} p={p} />)}</div>
          </div>
          <div className="rolar-quadro">
            {CAPITULOS.map((cap, i) => <Camada key={cap.img} i={i} n={n} p={p} cap={cap} />)}
            <motion.span className="continue" style={{ opacity: opAviso }} aria-hidden="true">
              Continue rolando
              <svg viewBox="0 0 24 24"><path d="M6 9.5 12 15.5 18 9.5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="square" /></svg>
            </motion.span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* Sem movimento: comparador que a pessoa arrasta */
function LimpezaParada() {
  return (
    <div className="gutter parada"><div className="miolo parada-grade">
      {CAPITULOS.map((c) => <Comparador key={c.img} c={c} />)}
    </div></div>
  )
}
function Comparador({ c }) {
  const [v, setV] = useState(50)
  return (
    <figure>
      <div className="comparador">
        <img src={`img/${c.img}-antes.webp`} alt={`${c.alt} antes da limpeza`} />
        <img src={`img/${c.img}-depois.webp`} alt={`${c.alt} depois da limpeza`} style={{ clipPath: `inset(0 ${100 - v}% 0 0)` }} />
        <span className="rodo" style={{ left: `${v}%` }}><b /></span>
        <input id={`comparar-${c.img}`} type="range" min="0" max="100" value={v} onChange={(e) => setV(+e.target.value)} aria-label={`Comparar antes e depois: ${c.nome}`} />
      </div>
      <figcaption>{c.nome}</figcaption>
    </figure>
  )
}

const ETAPAS = [
  ['Limpeza grossa', 'Retirada de poeira pesada, restos de argamassa e resíduos da obra.'],
  ['Limpeza fina', 'Pisos, revestimentos, louças, metais, vidros e caixilhos, ambiente por ambiente.'],
  ['Limpeza final', 'Acabamento dos ambientes antes da vistoria e da entrega.'],
  ['Revisão', 'Volta aos pontos que ainda precisam de atenção, até a área ser liberada.']
]
const BOLETIM = [
  ['Dias trabalhados', 'A data de cada dia de serviço.'],
  ['Efetivo', 'Quantos colaboradores estavam na obra naquele dia.'],
  ['Quadro de colaboradores', 'Quem trabalhou em cada diária.'],
  ['Demandas', 'A área ou o pavimento atendido.'],
  ['Total', 'A soma das diárias do período.']
]

function Etapas() {
  const ref = useRef(null)
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start 78%', 'end 62%'] })
  const s = useSpring(p, { stiffness: 90, damping: 24 })
  return (
    <section className="etapas-sec gutter" id="etapas">
      <div className="miolo">
        <p className="rotulo">Como funciona a obra</p>
        <Palavras texto="Da poeira pesada à revisão final" />
        <ol className="etapas" ref={ref}>
          <motion.span className="etapas-linha" style={{ '--s': s }} aria-hidden="true" />
          {ETAPAS.map(([t, d], i) => (
            <Surge as="li" key={t} atraso={i * 0.08} y={24}>
              <span className="etapa-num">{i + 1}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </Surge>
          ))}
        </ol>

        <div className="boletim">
          <div className="boletim-texto">
            <p className="rotulo">Como a medição funciona</p>
            <Palavras texto="Cada diária registrada, para a obra conferir" />
            <p>O serviço é medido por diária. No fechamento, a obra recebe um boletim simples com o que foi feito em cada dia.</p>
            <Botao href={linkZap(`${ORC} de limpeza pós-obra.`)}><IconeZap />Pedir orçamento de pós-obra</Botao>
          </div>
          <motion.dl className="boletim-linhas" initial="o" whileInView="s" viewport={{ once: true, margin: '-14% 0px' }} variants={{ o: {}, s: { transition: { staggerChildren: 0.14 } } }}>
            {BOLETIM.map(([t, d]) => (
              <motion.div key={t} variants={{ o: { opacity: 0.25, x: 22 }, s: { opacity: 1, x: 0, transition: { duration: 0.55, ease: FACIL } } }}>
                <svg viewBox="0 0 24 24" className="confere" aria-hidden="true">
                  <motion.path d="M4 12.5 9.5 18 20 6.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" variants={{ o: { pathLength: 0 }, s: { pathLength: 1, transition: { duration: 0.5, delay: 0.15 } } }} />
                </svg>
                <dt>{t}</dt>
                <dd>{d}</dd>
              </motion.div>
            ))}
          </motion.dl>
        </div>
      </div>
    </section>
  )
}

const SERVICOS = [
  { id: 'limpeza-geral', tom: 'branco', rot: 'Condomínios e empresas', nome: 'Limpeza geral', foto: 'limpeza', alt: 'Dois profissionais uniformizados limpando o piso do hall de um edifício, com carrinho de limpeza', txt: 'Equipe para a rotina de limpeza de áreas comuns, recepções e ambientes de trabalho, com a frequência que o local precisa.', lista: ['Halls, corredores e recepções', 'Pisos, vidros e banheiros', 'Atendimento recorrente'], zap: 'limpeza geral' },
  { id: 'portaria', tom: 'preto', rot: 'Condomínios, empresas e obras', nome: 'Portaria e controle de acesso', foto: 'portaria', alt: 'Porteiro uniformizado atendendo uma moradora no portão de um condomínio', txt: 'Atendimento cordial na entrada e controle organizado de quem entra e de quem sai.', lista: ['Identificação de visitantes', 'Triagem de colaboradores', 'Controle de prestadores de serviço', 'Direcionamento de entregadores'], zap: 'portaria e controle de acesso' },
  { id: 'zeladoria', tom: 'ouro', rot: 'Condomínios e empresas', nome: 'Zeladoria', foto: 'zeladoria', alt: 'Zelador uniformizado com prancheta verificando uma luminária no jardim de um condomínio', txt: 'Um profissional que acompanha o dia a dia do local e cuida para que as áreas comuns continuem em ordem.', lista: ['Rotina nas áreas comuns', 'Verificação de itens do local', 'Apoio à administração ou ao síndico'], zap: 'zeladoria' }
]

function CartaoServico({ s, i, total, geral, desktop }) {
  const alvo = 1 - (total - 1 - i) * 0.035
  const ini = i / total
  const esc = useTransform(geral, [ini, 1], [1, desktop ? alvo : 1])
  const ref = useRef(null)
  const { scrollYProgress: q } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const fotoY = useTransform(q, [0, 1], ['-8%', '8%'])
  return (
    <div className="cartao-pino" ref={ref} style={{ top: desktop ? `${92 + i * 18}px` : undefined }}>
      <motion.article id={s.id} className={`cartao tom-${s.tom}`} style={{ scale: esc }}>
        <div className="cartao-foto">
          <motion.img style={{ y: fotoY, scale: 1.18 }} src={`img/${s.foto}.webp`} alt={s.alt} width="1200" height="675" loading="lazy" />
        </div>
        <div className="cartao-texto">
          <p className="rotulo">{s.rot}</p>
          <h2>{s.nome}</h2>
          <p className="cartao-desc">{s.txt}</p>
          <ul>{s.lista.map((l) => <li key={l}>{l}</li>)}</ul>
          <a className="seta" href={linkZap(`${ORC} de ${s.zap}.`)} target="_blank" rel="noopener">Pedir orçamento <span aria-hidden="true">→</span></a>
        </div>
      </motion.article>
    </div>
  )
}

function Servicos() {
  const ref = useRef(null)
  const desktop = useDesktop()
  const { scrollYProgress: geral } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  return (
    <section className="servicos gutter" id="servicos">
      <div className="miolo">
        <div className="servicos-cab">
          <p className="rotulo">Para condomínios e empresas</p>
          <Palavras texto="Depois da obra, a rotina do prédio" />
        </div>
        <div className="pilha" ref={ref}>
          {SERVICOS.map((s, i) => <CartaoServico key={s.id} s={s} i={i} total={SERVICOS.length} geral={geral} desktop={desktop} />)}
        </div>
      </div>
    </section>
  )
}

function Empresa() {
  const [copiado, setCopiado] = useState(false)
  const copiar = async () => {
    try { await navigator.clipboard.writeText('57.602.707/0001-95'); setCopiado(true); setTimeout(() => setCopiado(false), 1800) } catch { setCopiado(false) }
  }
  const linhas = [
    ['Nome fantasia', 'Grupo TGL'],
    ['Razão social', 'TGL Serviços de Limpeza, Portaria e Manutenção Predial Ltda'],
    ['Inscrição estadual', '151.157.868.115'],
    ['Abertura', '08/10/2024'],
    ['Situação cadastral', 'Ativa']
  ]
  return (
    <section className="empresa gutter" id="empresa">
      <div className="miolo empresa-grade">
        <div>
          <p className="rotulo">Como trabalhamos</p>
          <Palavras texto="Primeiro entender o local, depois montar a equipe" />
          <ol className="passos">
            {['Identificamos a necessidade do cliente e do local.', 'Definimos a equipe e a estrutura.', 'Executamos o serviço.', 'Acompanhamos a execução.'].map((t, i) => (
              <Surge as="li" key={t} atraso={i * 0.07} y={18}><b>{i + 1}</b>{t}</Surge>
            ))}
          </ol>
        </div>
        <Surge>
          <p className="rotulo">Dados da empresa</p>
          <dl className="cadastro">
            <div className="cadastro-cnpj">
              <dt>CNPJ</dt>
              <dd>57.602.707/0001-95
                <button id="copiar-cnpj" type="button" onClick={copiar} className="copiar">
                  <AnimatePresence mode="wait">
                    <motion.span key={copiado ? 's' : 'n'} initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -8, opacity: 0 }} transition={{ duration: 0.15 }}>{copiado ? 'Copiado' : 'Copiar'}</motion.span>
                  </AnimatePresence>
                </button>
              </dd>
            </div>
            {linhas.map(([a, b]) => <div key={a}><dt>{a}</dt><dd>{b}</dd></div>)}
          </dl>
        </Surge>
      </div>
    </section>
  )
}

const OPCOES = ['Limpeza pós-obra', 'Limpeza geral', 'Portaria e controle de acesso', 'Zeladoria', 'Outro']

function Contato() {
  const [f, setF] = useState({ nome: '', empresa: '', servico: '', local: '', mensagem: '' })
  const [erros, setErros] = useState({})
  const [enviado, setEnviado] = useState(false)
  const muda = (k) => (e) => { setF({ ...f, [k]: e.target.value }); setErros({ ...erros, [k]: false }); setEnviado(false) }
  const texto = useMemo(() => {
    const l = ['Olá, vim pelo site da TGL.', '', `Nome: ${f.nome.trim()}`]
    if (f.empresa.trim()) l.push(`Empresa ou condomínio: ${f.empresa.trim()}`)
    l.push(`Serviço: ${f.servico}`, `Local: ${f.local.trim()}`)
    if (f.mensagem.trim()) l.push(`Mensagem: ${f.mensagem.trim()}`)
    return l.join('\n')
  }, [f])
  const clique = (e) => {
    const er = { nome: !f.nome.trim(), servico: !f.servico, local: !f.local.trim() }
    setErros(er)
    if (er.nome || er.servico || er.local) {
      e.preventDefault()
      const prim = er.nome ? 'nome' : er.servico ? `servico-0` : 'local'
      document.getElementById(prim)?.focus()
      setEnviado(false)
      return
    }
    setEnviado(true)
  }
  const falta = erros.nome || erros.servico || erros.local
  return (
    <section className="contato gutter" id="contato">
      <div className="miolo">
        <div className="contato-cab">
          <div>
            <p className="rotulo rotulo-tinta">Entre em contato</p>
            <Palavras texto="Conte o que você precisa" />
          </div>
          <div className="contato-dados">
            <a href={linkZap(`${ORC}.`)} target="_blank" rel="noopener">(11) 96356-2532</a>
            <a href="mailto:tglslpm@gmail.com">tglslpm@gmail.com</a>
          </div>
        </div>
        <div className="contato-grade">
          <form onSubmit={(e) => e.preventDefault()} noValidate>
            <fieldset className={erros.servico ? 'erro' : ''}>
              <legend>Qual serviço?</legend>
              <div className="fichas">
                {OPCOES.map((o, i) => (
                  <label key={o} className={f.servico === o ? 'on' : ''}>
                    <input id={`servico-${i}`} type="radio" name="servico" value={o} checked={f.servico === o} onChange={muda('servico')} />
                    {f.servico === o && <motion.span className="ficha-fundo" layoutId="ficha" transition={{ type: 'spring', stiffness: 420, damping: 32 }} />}
                    <span className="ficha-txt">{o}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="campos">
              <div className={`campo ${erros.nome ? 'erro' : ''}`}><label htmlFor="nome">Nome</label><input id="nome" type="text" autoComplete="name" value={f.nome} onChange={muda('nome')} /></div>
              <div className="campo"><label htmlFor="empresa-nome">Empresa ou condomínio <small>(opcional)</small></label><input id="empresa-nome" type="text" autoComplete="organization" value={f.empresa} onChange={muda('empresa')} /></div>
              <div className={`campo campo-todo ${erros.local ? 'erro' : ''}`}><label htmlFor="local">Bairro ou cidade</label><input id="local" type="text" autoComplete="address-level2" value={f.local} onChange={muda('local')} /></div>
              <div className="campo campo-todo"><label htmlFor="mensagem">Mensagem <small>(opcional)</small></label><textarea id="mensagem" rows="3" placeholder="Ex.: tamanho da área, prazo de entrega ou número de postos" value={f.mensagem} onChange={muda('mensagem')} /></div>
            </div>
            <motion.a id="enviar" className="botao botao-preto" href={linkZap(texto)} target="_blank" rel="noopener" onClick={clique} whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}><IconeZap />Enviar pelo WhatsApp</motion.a>
            <p id="aviso" role="status" className={falta ? 'ruim' : ''}>
              {falta ? 'Preencha serviço, nome e bairro ou cidade para continuar.' : enviado ? 'O WhatsApp abre em outra aba. A mensagem só chega à TGL depois que você tocar em enviar.' : 'Serviço, nome e bairro ou cidade são obrigatórios.'}
            </p>
          </form>
          <aside className="previa" aria-label="Prévia da mensagem">
            <div className="previa-topo"><img src="img/favicon.png" alt="" width="36" height="36" /><div><b>TGL</b><span>Prévia da sua mensagem</span></div></div>
            <div className="previa-chat">
              <motion.div className="balao" layout transition={{ type: 'spring', stiffness: 320, damping: 30 }}>
                <p>Olá, vim pelo site da TGL.</p>
                <AnimatePresence initial={false}>
                  {[['Nome', f.nome], ['Empresa', f.empresa], ['Serviço', f.servico], ['Local', f.local], ['Mensagem', f.mensagem]].filter(([, v]) => v.trim()).map(([k, v]) => (
                    <motion.p key={k} layout="position" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22 }}><b>{k}:</b> {v}</motion.p>
                  ))}
                </AnimatePresence>
              </motion.div>
              {!f.nome && !f.servico && <motion.p className="previa-dica" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Sua mensagem vai aparecer aqui enquanto você preenche.</motion.p>}
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}

function ZapFixo() {
  const [dica, setDica] = useState(false)
  useEffect(() => {
    const a = setTimeout(() => setDica(true), 3500)
    const b = setTimeout(() => setDica(false), 9000)
    return () => { clearTimeout(a); clearTimeout(b) }
  }, [])
  return (
    <div className="zap-caixa">
      <AnimatePresence>
        {dica && <motion.span className="zap-dica" initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 14 }} transition={{ duration: 0.3 }}>Peça um orçamento</motion.span>}
      </AnimatePresence>
      <motion.a className="zap-fixo" href={linkZap(`${ORC}.`)} target="_blank" rel="noopener" aria-label="Falar com a TGL no WhatsApp"
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.9 }} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }}>
        <IconeZap />
      </motion.a>
    </div>
  )
}

export default function App() {
  const reduzido = useReducedMotion()
  useEffect(() => {
    let lenis = null
    let raf = 0
    if (!reduzido) {
      lenis = new Lenis({ duration: 1.05, smoothWheel: true })
      const loop = (t) => { lenis.raf(t); raf = requestAnimationFrame(loop) }
      raf = requestAnimationFrame(loop)
    }
    const clique = (e) => {
      const a = e.target.closest && e.target.closest('a[href^="#"]')
      if (!a) return
      const el = document.querySelector(a.getAttribute('href'))
      if (!el) return
      e.preventDefault()
      if (lenis) lenis.scrollTo(el, { offset: -72 })
      else el.scrollIntoView()
    }
    document.addEventListener('click', clique)
    return () => { document.removeEventListener('click', clique); cancelAnimationFrame(raf); lenis && lenis.destroy() }
  }, [reduzido])

  return (
    <MotionConfig reducedMotion="user">
      <Topo />
      <main>
        <Capa />
        <Letreiro />
        <section className="obra" id="pos-obra">
          <div className="gutter"><div className="miolo obra-cab">
            <p className="rotulo">Para construtoras e incorporadoras</p>
            <Palavras texto="Limpeza pós-obra para a última etapa não atrasar a entrega" />
            <Surge><p className="lede">Do resíduo pesado à revisão final, a TGL deixa os ambientes prontos para vistoria e entrega. A equipe trabalha uniformizada, com EPI e as ferramentas de cada etapa.</p></Surge>
          </div></div>
          {reduzido ? <LimpezaParada /> : <LimpezaRolando />}
        </section>
        <Etapas />
        <Servicos />
        <Empresa />
        <Contato />
      </main>
      <footer className="rodape gutter">
        <div className="miolo rodape-grade">
          <img src="img/logo.webp" width="420" height="476" alt="TGL" loading="lazy" />
          <div>
            <p>TGL Serviços de Limpeza, Portaria e Manutenção Predial Ltda. CNPJ 57.602.707/0001-95. São Paulo, SP.</p>
          </div>
        </div>
      </footer>
      <ZapFixo />
    </MotionConfig>
  )
}
