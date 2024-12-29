const TempOverlayTest = () => {
  return (
    <div className="absolute inset-0">
      <div className="grid grid-cols-14 grid-rows-5 gap-1 h-full">
        <div className="row-span-3 grid grid-rows-2 gap-1">
          <div className="w-full h-full bg-white/20 flex items-center justify-center">0</div>
          <div className="w-full h-full bg-white/20 flex items-center justify-center">00</div>
        </div>

        <div className="col-span-12 row-span-3 grid grid-rows-3 gap-1">
          <div className="grid grid-cols-12 gap-1">
            {[3,6,9,12,15,18,21,24,27,30,33,36].map(num => (
              <div key={num} className="w-full h-full bg-white/20 flex items-center justify-center">{num}</div>
            ))}
          </div>
          <div className="grid grid-cols-12 gap-1">
            {[2,5,8,11,14,17,20,23,26,29,32,35].map(num => (
              <div key={num} className="w-full h-full bg-white/20 flex items-center justify-center">{num}</div>
            ))}
          </div>
          <div className="grid grid-cols-12 gap-1">
            {[1,4,7,10,13,16,19,22,25,28,31,34].map(num => (
              <div key={num} className="w-full h-full bg-white/20 flex items-center justify-center">{num}</div>
            ))}
          </div>
        </div>

        <div className="row-span-3 col-start-14 grid grid-rows-3 gap-1">
          <div className="w-full h-full bg-white/20 flex items-center justify-center">C3</div>
          <div className="w-full h-full bg-white/20 flex items-center justify-center">C2</div>
          <div className="w-full h-full bg-white/20 flex items-center justify-center">C1</div>
        </div>

        <div className="row-span-2 row-start-4" />

        <div className="col-span-12 row-start-4 grid grid-cols-3 gap-1">
          <div className="w-full h-full bg-white/20 flex items-center justify-center">1ère</div>
          <div className="w-full h-full bg-white/20 flex items-center justify-center">2ème</div>
          <div className="w-full h-full bg-white/20 flex items-center justify-center">3ème</div>
        </div>

        <div className="col-span-12 col-start-2 row-start-5 grid grid-cols-6 gap-1">
          <div className="w-full h-full bg-white/20 flex items-center justify-center">1-18</div>
          <div className="w-full h-full bg-white/20 flex items-center justify-center">PAIR</div>
          <div className="w-full h-full bg-white/20 flex items-center justify-center">ROUGE</div>
          <div className="w-full h-full bg-white/20 flex items-center justify-center">NOIR</div>
          <div className="w-full h-full bg-white/20 flex items-center justify-center">IMPAIR</div>
          <div className="w-full h-full bg-white/20 flex items-center justify-center">19-36</div>
        </div>
        
        <div className="row-span-2 col-start-14 row-start-4" />
      </div>
    </div>
  )
}

export default TempOverlayTest