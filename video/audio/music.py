import numpy as np
from scipy.signal import butter, sosfilt
from scipy.io import wavfile
SR=48000; DUR=2094/30; N=int(SR*DUR); rng=np.random.default_rng(7)
t=np.arange(N)/SR
L=np.zeros(N); R=np.zeros(N)
BPM=96; beat=60/BPM; bar=4*beat
def lp(x,f): return sosfilt(butter(2,f,'low',fs=SR,output='sos'),x)
def hp(x,f): return sosfilt(butter(2,f,'high',fs=SR,output='sos'),x)
def bp(x,a,b): return sosfilt(butter(2,[a,b],'band',fs=SR,output='sos'),x)
def env_ar(n,a,r): 
    e=np.ones(n); na=max(1,int(a*SR)); e[:na]=np.linspace(0,1,na); e*=np.exp(-np.arange(n)/SR/r) if r else 1; return e
def add(buf_l,buf_r,start,sig,pan=0.0,g=1.0):
    i=int(start*SR); 
    if i>=N: return
    s=sig[:N-i]*g; buf_l[i:i+len(s)]+=s*np.sqrt((1-pan)/2); buf_r[i:i+len(s)]+=s*np.sqrt((1+pan)/2)
m2f=lambda m:440*2**((m-69)/12)
# timeline (seconds)
REVEAL=351/30; LESSONS=1596/30; END=1854/30
# chords: Dm9, Bbmaj7, Fmaj7/A, C6sus
chords=[[50,53,57,60,64],[46,50,53,57,62],[45,48,53,57,60],[48,52,55,57,62]]
bass=[38,34,33,36]
# pads
pad=np.zeros(N); padR=np.zeros(N)
nb=int(DUR/bar)+2
for b in range(nb):
    st=b*bar; ch=chords[b%4]; n=int(bar*SR*1.25); tt=np.arange(n)/SR
    e=np.minimum(1,tt/0.8)*np.minimum(1,np.maximum(0,(bar*1.25-tt)/0.6))
    sl=np.zeros(n); sr_=np.zeros(n)
    for m in ch:
        f=m2f(m)
        for d,p in [(-0.12,-0.7),(0.0,0),(0.11,0.7)]:
            ff=f*2**(d/12/2); w=2*(tt*ff%1)-1
            sl+=w*np.sqrt((1-p)/2); sr_+=w*np.sqrt((1+p)/2)
    i=int(st*SR); k=min(n,N-i)
    if k<=0: break
    pad[i:i+k]+=(sl*e)[:k]; padR[i:i+k]+=(sr_*e)[:k]
# pad filter: closed before reveal, opens after
cut=np.where(t<REVEAL, 500+400*(t/REVEAL), np.where(t<LESSONS, 1800, np.where(t<END,1300,1100)))
# chunked variable lowpass
def varlp(x):
    y=np.zeros_like(x); step=SR//10
    for i in range(0,N,step): 
        seg=x[max(0,i-SR//5):i+step]; f=float(cut[i]); out=lp(seg,f); y[i:i+step]=out[-len(x[i:i+step]):]
    return y
L+=varlp(pad)*0.018; R+=varlp(padR)*0.018
# sub/bass after reveal
for b in range(nb):
    st=b*bar
    if st<REVEAL-0.01 or st>=END+bar: continue
    for k,off in enumerate([0,1.5*beat,2*beat,3.5*beat]):
        n=int(beat*0.9*SR); tt=np.arange(n)/SR; f=m2f(bass[b%4])
        s=(np.sin(2*np.pi*f*tt)+0.3*np.sin(4*np.pi*f*tt))*env_ar(n,0.005,0.35)
        g=0.16 if st<LESSONS else 0.10
        add(L,R,st+off,lp(s,400),0,g)
# drums
def kick():
    n=int(0.45*SR); tt=np.arange(n)/SR; f=45+90*np.exp(-tt*30)
    return np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-tt*7)
def clap():
    n=int(0.3*SR); x=rng.standard_normal(n); x=bp(x,900,4000)
    tt=np.arange(n)/SR; e=np.exp(-tt*18); 
    for d in (0.0,0.011,0.022): e+=np.exp(-np.maximum(0,tt-d)*120)*(tt>=d)*0.6
    return x*e*0.5
def hat(o=False):
    n=int((0.25 if o else 0.06)*SR); x=hp(rng.standard_normal(n),7000); return x*np.exp(-np.arange(n)/SR*(14 if o else 70))
def tick():
    n=int(0.03*SR); tt=np.arange(n)/SR; return np.sin(2*np.pi*2400*tt)*np.exp(-tt*300)
K=kick(); CL=clap()
# BEFORE section: clock ticks (old site feel)
tk=tick(); x=108/30
while x<REVEAL-0.4:
    add(L,R,x,tk,0.4 if int(x/beat)%2 else -0.4,0.10); x+=beat
# Groove
nbeats=int(DUR/beat)+1
for i in range(nbeats):
    s=i*beat
    if s<REVEAL-0.01 or s>=END+2*bar: continue
    full=s<LESSONS; endsec=s>=END
    if i%2==0 and not endsec: add(L,R,s,K,0,0.42 if full else 0.22)
    if i%4 in (1,3) and full: add(L,R,s,CL,0.05,0.22)
    if full or (not endsec):
        add(L,R,s+beat/2,hat(),0.3,0.07 if full else 0.04)
        if full: add(L,R,s,hat(),-0.3,0.045)
    if i%8==7 and full: add(L,R,s+beat/2,hat(True),0.2,0.05)
# pluck arpeggio (after reveal through end)
def pluck(f):
    n=int(0.6*SR); tt=np.arange(n)/SR; w=np.sign(np.sin(2*np.pi*f*tt))*0.4+np.sin(2*np.pi*f*tt)
    return lp(w*np.exp(-tt*6),2600)
pat=[0,2,4,3,1,4,2,3]
for i in range(int(DUR/(beat/2))+1):
    s=i*beat/2
    if s<REVEAL+bar-0.01: continue
    if s>=END+bar: continue
    b=int(s/bar); ch=chords[b%4]; m=ch[pat[i%8]]+12
    add(L,R,s,pluck(m2f(m)),0.5 if i%2 else -0.5,0.05 if s<END else 0.035)
# FX: riser into reveal, impact, whooshes at cuts, click
def noise_riser(d):
    n=int(d*SR); tt=np.arange(n)/SR; x=rng.standard_normal(n)
    y=np.zeros(n); step=SR//20
    for i in range(0,n,step):
        fc=300+6000*(i/n)**2; y[i:i+step]=bp(x[max(0,i-2000):i+step],fc*0.7,min(fc*1.4,20000))[-len(x[i:i+step]):]
    return y*(tt/d)**2
add(L,R,REVEAL-2.0,noise_riser(2.0),0,0.25)
n=int(2.5*SR); tt=np.arange(n)/SR
boom=np.sin(2*np.pi*np.cumsum(38+60*np.exp(-tt*12))/SR)*np.exp(-tt*2.2)+lp(rng.standard_normal(n),900)*np.exp(-tt*5)*0.4
add(L,R,REVEAL,boom,0,0.55)
def whoosh(d=0.5):
    n=int(d*SR); tt=np.arange(n)/SR; x=rng.standard_normal(n); e=np.sin(np.pi*tt/d)**2
    return bp(x,600,5000)*e
cuts=[108,423,621,834,1032,1185,1368,1596,1854]
for c in cuts: add(L,R,c/30-0.25,whoosh(),0.0,0.07)
click=hp(rng.standard_normal(int(0.02*SR)),2000)*np.exp(-np.arange(int(0.02*SR))/SR*400)
add(L,R,(1185+128)/30,click,0.2,0.35)
# end swell chord ring
n=int(8*SR); tt=np.arange(n)/SR; sw=np.zeros(n)
for m in [50,57,62,64,69]: sw+=np.sin(2*np.pi*m2f(m)*tt)
add(L,R,END,sw*np.minimum(1,tt/1.5)*np.exp(-tt*0.25),0,0.02)
# master: fades, soft clip
fade=np.ones(N); fi=int(0.3*SR); fade[:fi]=np.linspace(0,1,fi); fo=int(2.0*SR); fade[-fo:]=np.linspace(1,0,fo)**1.5
L*=fade; R*=fade
st=np.stack([L,R],1); st=np.tanh(st*1.4)/1.4
st/=np.max(np.abs(st))*1.12
wavfile.write('/home/claude/kesh-video/audio/music.wav',SR,(st*32767).astype(np.int16))
print('ok',DUR)
