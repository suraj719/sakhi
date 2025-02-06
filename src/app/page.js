"use client";
import Navbar from "@/components/navbar";
export default function Home() {
  // Reference to the notification section
  const notificationRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // Intersection Observer callback to detect visibility
  const handleIntersection = (entries) => {
    const entry = entries[0];
    setIsVisible(entry.isIntersecting); // Update visibility state based on whether the section is in view
  };

  // Setup IntersectionObserver to detect when the notification section comes into view
  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.1, // 10% of the section must be in view for it to be considered "in view"
    });

    if (notificationRef.current) {
      observer.observe(notificationRef.current); // Start observing the section
    }

    return () => {
      if (notificationRef.current) {
        observer.unobserve(notificationRef.current); // Cleanup observer when the component unmounts
      }
    };
  }, []);

  return (
    <div>
      <div className="h-[100%]">{/* <Navbar /> */}</div>
      <div>
        <h1>Hello World</h1>
      </div>
    </div>
  );
}
